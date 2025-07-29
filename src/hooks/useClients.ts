import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '../lib/supabase';
import type { AddClientForm } from '../types';

// Query keys
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters: string) => [...clientKeys.lists(), { filters }] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
};

// Hook to get all clients
export function useClients() {
  return useQuery({
    queryKey: clientKeys.lists(),
    queryFn: clientsApi.getAll,
  });
}

// Hook to get a single client
export function useClient(id: string) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => clientsApi.getById(id),
    enabled: !!id,
  });
}

// Hook to create a new client
export function useCreateClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (client: AddClientForm) => clientsApi.create({
      ...client,
      last_refreshed: null,
      cached_post_data: null
    }),
    onSuccess: () => {
      // Invalidate and refetch clients list
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}

// Hook to update client post data
export function useUpdateClientPosts() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, postData }: { id: string; postData: any[] }) =>
      clientsApi.updatePostData(id, postData),
    onSuccess: (updatedClient: any) => {
      // Update the specific client in cache
      queryClient.setQueryData(clientKeys.detail(updatedClient.id), updatedClient);
      // Invalidate the list to refresh sidebar
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
} 