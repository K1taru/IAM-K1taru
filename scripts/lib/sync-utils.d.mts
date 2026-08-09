export function normalizeRepo(value: string): string;
export function parseRepositoryList(value: string): string[];
export function isPrivateOrReservedIp(address: string): boolean;
export function validatePublicHttpsUrl(value: string | URL): URL;
export function classifyHttpStatus(status: number): 'online' | 'offline';

