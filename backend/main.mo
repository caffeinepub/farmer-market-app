import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";
import Time "mo:core/Time";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";
import UserApproval "user-approval/approval";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Authentication and User Management
  let accessControlState = AccessControl.initState();
  let approvalState = UserApproval.initState(accessControlState);

  // User Profile Type (required by frontend)
  public type UserProfile = {
    name : Text;
    role : Text; // "job_seeker", "employer", "admin"
    isApproved : Bool;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Job and Application Types
  public type JobListing = {
    id : Text;
    employer : Principal;
    title : Text;
    description : Text;
    requiredSkills : [Text];
    location : Text;
    salaryRange : Text;
    jobType : Text;
    deadline : Time.Time;
    isActive : Bool;
  };

  public type JobApplication = {
    id : Text;
    jobSeekerId : Principal;
    jobId : Text;
    status : Text; // Applied, Shortlisted, Rejected, Hired
    resume : ?Storage.ExternalBlob;
    appliedAt : Time.Time;
  };

  public type JobRecommendation = {
    jobId : Text;
    score : Nat;
  };

  public type SalaryPrediction = {
    minSalary : Nat;
    maxSalary : Nat;
    jobCategory : Text;
    experienceYears : Nat;
  };

  public type Interview = {
    id : Text;
    applicantId : Principal;
    jobId : Text;
    scheduledDate : Time.Time;
    notes : Text;
  };

  // Main Data Storage
  let jobs = Map.empty<Text, JobListing>();
  let applications = Map.empty<Text, JobApplication>();
  let interviews = Map.empty<Text, Interview>();
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // Include File Storage Mixin
  include MixinStorage();

  // Include Authorization Mixin
  include MixinAuthorization(accessControlState);

  // ─── User Profile Functions (required by frontend) ───────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ─── Job Listing Management ──────────────────────────────────────────────

  public shared ({ caller }) func postJob(job : JobListing) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can post jobs");
    };
    // Only approved employers or admins can post jobs
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved employers can post jobs");
    };
    if (job.employer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot post a job on behalf of another employer");
    };
    jobs.add(job.id, job);
  };

  public shared ({ caller }) func updateJob(job : JobListing) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can update jobs");
    };
    // Only approved employers or admins can update jobs
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved employers can update jobs");
    };
    // Ownership check: only the owning employer or admin may update
    switch (jobs.get(job.id)) {
      case (null) { Runtime.trap("Job not found") };
      case (?existing) {
        if (existing.employer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot update another employer's job");
        };
      };
    };
    jobs.add(job.id, job);
  };

  public shared ({ caller }) func deleteJob(jobId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can delete jobs");
    };
    // Only approved employers or admins can delete jobs
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved employers can delete jobs");
    };
    // Ownership check: only the owning employer or admin may delete
    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?existing) {
        if (existing.employer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot delete another employer's job");
        };
      };
    };
    jobs.remove(jobId);
  };

  // ─── Job Searching and Recommendations ───────────────────────────────────

  // Public: anyone (including guests) can browse active jobs
  public query func getActiveJobs() : async [JobListing] {
    jobs.values().toArray().filter(func(j) { j.isActive });
  };

  // Public: anyone (including guests) can browse jobs by category
  public query func getJobsByCategory(category : Text) : async [JobListing] {
    jobs.values().toArray().filter(func(j) { j.jobType == category and j.isActive });
  };

  // Only authenticated users (job seekers) can get personalized recommendations
  public query ({ caller }) func getJobRecommendations(candidateSkills : [Text], jobCategory : Text) : async [JobRecommendation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can get job recommendations");
    };
    let allJobs = jobs.values().toArray();
    let matchingJobs = allJobs.filter(func(job) { job.jobType == jobCategory and job.isActive });

    let recommendations = matchingJobs.map(
      func(job) {
        // Count overlaps between candidate skills and job skills
        var matchCount = 0;
        for (jobSkill in job.requiredSkills.values()) {
          for (candidateSkill in candidateSkills.values()) {
            if (candidateSkill == jobSkill) { matchCount += 1 };
          };
        };
        { jobId = job.id; score = matchCount };
      }
    );

    recommendations.filter(func(r) { r.score > 0 });
  };

  // ─── Resume and Application Management ───────────────────────────────────

  public shared ({ caller }) func applyForJob(application : JobApplication) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can apply for jobs");
    };
    if (application.jobSeekerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot submit an application on behalf of another user");
    };
    applications.add(application.id, application);
  };

  public query ({ caller }) func getMyJobApplications() : async [JobApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can view applications");
    };
    applications.values().toArray().filter(func(a) { a.jobSeekerId == caller });
  };

  // Employer views applicants for their own job; admin can view any job's applicants
  // Uses caller for ownership check (not a passed-in employerId parameter)
  public query ({ caller }) func getApplicationsForJob(jobId : Text) : async [JobApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can fetch applications");
    };
    switch (jobs.get(jobId)) {
      case (null) {
        // Job not found; only admin may proceed
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only admins can view applications for non-existent jobs");
        };
        applications.values().toArray().filter(func(a) { a.jobId == jobId });
      };
      case (?job) {
        if (job.employer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owning employer or admin can view applications");
        };
        applications.values().toArray().filter(func(a) { a.jobId == jobId });
      };
    };
  };

  // Update application status (Shortlisted, Rejected, Hired) — employer or admin only
  public shared ({ caller }) func updateApplicationStatus(applicationId : Text, newStatus : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can update application status");
    };
    switch (applications.get(applicationId)) {
      case (null) { Runtime.trap("Application not found") };
      case (?app) {
        // Verify caller is the employer who owns the job, or an admin
        switch (jobs.get(app.jobId)) {
          case (null) {
            if (not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only admins can update status for applications on missing jobs");
            };
          };
          case (?job) {
            if (job.employer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only the owning employer or admin can update application status");
            };
          };
        };
        let updated : JobApplication = {
          id = app.id;
          jobSeekerId = app.jobSeekerId;
          jobId = app.jobId;
          status = newStatus;
          resume = app.resume;
          appliedAt = app.appliedAt;
        };
        applications.add(applicationId, updated);
      };
    };
  };

  // Bulk update application statuses by employer or admin
  public shared ({ caller }) func updateApplicationsStatus(applicationsIds : [Text], newStatus : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can update application status");
    };

    for (id in applicationsIds.values()) {
      switch (applications.get(id)) {
        case (null) { Runtime.trap("Application not found") };
        case (?app) {
          switch (jobs.get(app.jobId)) {
            case (null) { Runtime.trap("Job not found") };
            case (?job) {
              if (job.employer == caller or AccessControl.isAdmin(accessControlState, caller)) {
                let updated : JobApplication = {
                  id = app.id;
                  jobSeekerId = app.jobSeekerId;
                  jobId = app.jobId;
                  status = newStatus;
                  resume = app.resume;
                  appliedAt = app.appliedAt;
                };
                applications.add(id, updated);
              } else {
                Runtime.trap("Unauthorized: Only the owning employer or admin can update application status");
              };
            };
          };
        };
      };
    };
  };

  // ─── Salary Prediction ───────────────────────────────────────────────────

  // Public: anyone can get salary predictions (useful for job seekers browsing)
  public query func predictSalary(jobCategory : Text, experienceYears : Nat) : async SalaryPrediction {
    let (minBase, maxBase) = switch (jobCategory) {
      case ("IT") { (30000, 60000) };
      case ("Finance") { (40000, 80000) };
      case ("Marketing") { (35000, 75000) };
      case ("Engineering") { (45000, 90000) };
      case (_) { (25000, 50000) };
    };

    // Adjust base by experience
    let minSalary = minBase + experienceYears * 5000;
    let maxSalary = maxBase + experienceYears * 7000;

    { minSalary; maxSalary; jobCategory; experienceYears };
  };

  // ─── Interview Scheduling (Approved Employers Only) ──────────────────────

  public shared ({ caller }) func scheduleInterview(interview : Interview) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can schedule interviews");
    };
    // Only approved employers or admins can schedule interviews
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved employers can schedule interviews");
    };
    // Verify caller owns the job associated with this interview
    switch (jobs.get(interview.jobId)) {
      case (null) {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only admins can schedule interviews for non-existent jobs");
        };
      };
      case (?job) {
        if (job.employer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owning employer or admin can schedule interviews for this job");
        };
      };
    };
    interviews.add(interview.id, interview);
  };

  // Job seekers view their own scheduled interviews
  public query ({ caller }) func getMyInterviews() : async [Interview] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can view their interviews");
    };
    interviews.values().toArray().filter(func(i) { i.applicantId == caller });
  };

  // Employer views all interviews they have scheduled
  public query ({ caller }) func getInterviewsScheduledByMe() : async [Interview] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can view scheduled interviews");
    };
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved employers can view scheduled interviews");
    };
    // Return interviews for jobs owned by this employer
    let myJobIds = jobs.values().toArray()
      .filter(func(j) { j.employer == caller })
      .map(func(j) { j.id });

    interviews.values().toArray().filter(
      func(i) {
        // Manual "contains" implementation
        var found = false;
        for (id in myJobIds.values()) {
          if (id == i.jobId) {
            found := true;
          };
        };
        found;
      }
    );
  };

  // ─── Admin: All Jobs Monitor ─────────────────────────────────────────────

  public query ({ caller }) func getAllJobs() : async [JobListing] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all jobs");
    };
    jobs.values().toArray();
  };

  // Admin removes a job (spam/fake listing moderation)
  public shared ({ caller }) func adminRemoveJob(jobId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can remove jobs");
    };
    jobs.remove(jobId);
  };

  // ─── Admin: System Reports ───────────────────────────────────────────────

  public type SystemReport = {
    totalUsersByRole : {
      jobSeekers : Nat;
      employers : Nat;
      admins : Nat;
    };
    totalJobs : Nat;
    totalApplications : Nat;
    totalHires : Nat;
  };

  public query ({ caller }) func getSystemReport() : async SystemReport {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view system reports");
    };

    var jobSeekers = 0;
    var employers = 0;
    var admins = 0;

    // Count users by role
    for ((_, profile) in userProfiles.entries()) {
      switch (profile.role) {
        case ("job_seeker") { jobSeekers += 1 };
        case ("employer") { employers += 1 };
        case ("admin") { admins += 1 };
        case (_) {};
      };
    };

    let totalJobs = jobs.size();
    let allApplications = applications.values().toArray();
    let totalApplications = allApplications.size();
    let totalHires = allApplications.filter(func(a) { a.status == "Hired" }).size();

    {
      totalUsersByRole = { jobSeekers; employers; admins };
      totalJobs;
      totalApplications;
      totalHires;
    };
  };

  // ─── Stripe Integration ─────────────────────────────────────────────────
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can create checkout sessions");
    };
    switch (stripeConfig) {
      case (null) { Runtime.trap("Error: Stripe configuration not set") };
      case (?config) { await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform) };
    };
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
  };

  // Public: anyone can check if Stripe is configured (needed for UI rendering)
  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  // Transform function for HTTP outcalls — must be public query, no auth needed
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can check session status");
    };
    switch (stripeConfig) {
      case (null) { Runtime.trap("Error: Stripe configuration not set") };
      case (?config) {
        await Stripe.getSessionStatus(config, sessionId, transform);
      };
    };
  };

  // ─── User Approval ─────────────────────────────────────────────────────

  // Any authenticated user can check their own approval status
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  // Only authenticated users can request approval (employers requesting to be approved)
  public shared ({ caller }) func requestApproval() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can request approval");
    };
    UserApproval.requestApproval(approvalState, caller);
  };

  // Only admins can approve or reject employer accounts
  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  // Only admins can list all approval requests
  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };
};
