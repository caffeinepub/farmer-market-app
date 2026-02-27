import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface SystemReport {
    totalUsersByRole: {
        employers: bigint;
        jobSeekers: bigint;
        admins: bigint;
    };
    totalHires: bigint;
    totalJobs: bigint;
    totalApplications: bigint;
}
export interface JobRecommendation {
    jobId: string;
    score: bigint;
}
export interface JobListing {
    id: string;
    title: string;
    jobType: string;
    description: string;
    deadline: Time;
    isActive: boolean;
    employer: Principal;
    salaryRange: string;
    requiredSkills: Array<string>;
    location: string;
}
export interface JobApplication {
    id: string;
    status: string;
    resume?: ExternalBlob;
    appliedAt: Time;
    jobId: string;
    jobSeekerId: Principal;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface Interview {
    id: string;
    applicantId: Principal;
    scheduledDate: Time;
    jobId: string;
    notes: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface SalaryPrediction {
    jobCategory: string;
    maxSalary: bigint;
    minSalary: bigint;
    experienceYears: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    isApproved: boolean;
    name: string;
    role: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminRemoveJob(jobId: string): Promise<void>;
    applyForJob(application: JobApplication): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteJob(jobId: string): Promise<void>;
    getActiveJobs(): Promise<Array<JobListing>>;
    getAllJobs(): Promise<Array<JobListing>>;
    getApplicationsForJob(jobId: string): Promise<Array<JobApplication>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInterviewsScheduledByMe(): Promise<Array<Interview>>;
    getJobRecommendations(candidateSkills: Array<string>, jobCategory: string): Promise<Array<JobRecommendation>>;
    getJobsByCategory(category: string): Promise<Array<JobListing>>;
    getMyInterviews(): Promise<Array<Interview>>;
    getMyJobApplications(): Promise<Array<JobApplication>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getSystemReport(): Promise<SystemReport>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    postJob(job: JobListing): Promise<void>;
    predictSalary(jobCategory: string, experienceYears: bigint): Promise<SalaryPrediction>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    scheduleInterview(interview: Interview): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateApplicationStatus(applicationId: string, newStatus: string): Promise<void>;
    updateApplicationsStatus(applicationsIds: Array<string>, newStatus: string): Promise<void>;
    updateJob(job: JobListing): Promise<void>;
}
