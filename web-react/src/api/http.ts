export function mapHttpError(status: number, statusText: string, errorText: string): string {
  return `${status} - ${statusText || ''} ${errorText}`;
}
