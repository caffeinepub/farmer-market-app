import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { JobListing, JobApplication, Interview, UserProfile, ApprovalStatus } from '../backend';
import { Principal } from '@dfinity/principal';

// ─── User Profile Hooks ───────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Job Listing Hooks ────────────────────────────────────────────────────────

export function useGetActiveJobs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobListing[]>({
    queryKey: ['activeJobs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveJobs();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllJobs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobListing[]>({
    queryKey: ['allJobs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJobs();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function usePostJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (job: JobListing) => {
      if (!actor) throw new Error('Actor not available');
      return actor.postJob(job);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeJobs'] });
      queryClient.invalidateQueries({ queryKey: ['allJobs'] });
    },
  });
}

export function useUpdateJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (job: JobListing) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateJob(job);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeJobs'] });
      queryClient.invalidateQueries({ queryKey: ['allJobs'] });
    },
  });
}

export function useDeleteJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteJob(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeJobs'] });
      queryClient.invalidateQueries({ queryKey: ['allJobs'] });
    },
  });
}

export function useAdminRemoveJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminRemoveJob(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeJobs'] });
      queryClient.invalidateQueries({ queryKey: ['allJobs'] });
    },
  });
}

// ─── Application Hooks ────────────────────────────────────────────────────────

export function useGetMyJobApplications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobApplication[]>({
    queryKey: ['myApplications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyJobApplications();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetApplicationsForJob(jobId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobApplication[]>({
    queryKey: ['applicationsForJob', jobId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApplicationsForJob(jobId);
    },
    enabled: !!actor && !actorFetching && !!jobId,
  });
}

export function useApplyForJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (application: JobApplication) => {
      if (!actor) throw new Error('Actor not available');
      return actor.applyForJob(application);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, newStatus }: { applicationId: string; newStatus: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateApplicationStatus(applicationId, newStatus);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applicationsForJob'] });
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
  });
}

// ─── Interview Hooks ──────────────────────────────────────────────────────────

export function useGetMyInterviews() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Interview[]>({
    queryKey: ['myInterviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyInterviews();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetInterviewsScheduledByMe() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Interview[]>({
    queryKey: ['interviewsScheduledByMe'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInterviewsScheduledByMe();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useScheduleInterview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interview: Interview) => {
      if (!actor) throw new Error('Actor not available');
      return actor.scheduleInterview(interview);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviewsScheduledByMe'] });
      queryClient.invalidateQueries({ queryKey: ['myInterviews'] });
    },
  });
}

// ─── AI / Recommendation Hooks ────────────────────────────────────────────────

export function useGetJobRecommendations(skills: string[], category: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['jobRecommendations', skills, category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJobRecommendations(skills, category);
    },
    enabled: !!actor && !actorFetching && skills.length > 0,
  });
}

export function usePredictSalary(jobCategory: string, experienceYears: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['salaryPrediction', jobCategory, experienceYears],
    queryFn: async () => {
      if (!actor) return null;
      return actor.predictSalary(jobCategory, BigInt(experienceYears));
    },
    enabled: !!actor && !actorFetching && !!jobCategory,
  });
}

// ─── Admin / Approval Hooks ───────────────────────────────────────────────────

export function useIsCallerApproved() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerApproved'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useRequestApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestApproval();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCallerApproved'] });
      queryClient.invalidateQueries({ queryKey: ['listApprovals'] });
    },
  });
}

export function useListApprovals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['listApprovals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, status }: { user: Principal; status: ApprovalStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setApproval(user, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listApprovals'] });
    },
  });
}

export function useGetSystemReport() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['systemReport'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSystemReport();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAssignCallerUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: import('../backend').UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listApprovals'] });
    },
  });
}
