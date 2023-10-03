export function formatCpf(document: string): string {
  return document ? document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : '';
}
