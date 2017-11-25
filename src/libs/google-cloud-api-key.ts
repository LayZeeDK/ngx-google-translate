export type GoogleCloudApiKey = string;

export function createGoogleCloudApiKey(key: string): GoogleCloudApiKey {
  return key as GoogleCloudApiKey;
}
