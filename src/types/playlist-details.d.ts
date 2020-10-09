interface PlaylistDetails {
  [key: string]: string | boolean;
  art?: string;
  collaborative: boolean;
  description: string;
  name: string;
  isPublic: boolean;
  populate?: boolean;
}
