export function getPreviewReturnHref(classId: string | undefined, materialId: string | undefined, returnToAI: boolean): string {
  if (!classId || !materialId) return "/lms/tutor/materials";
  const href = `/lms/tutor/materials/classes/${encodeURIComponent(classId)}`;
  return returnToAI ? `${href}?ai=${encodeURIComponent(materialId)}` : href;
}
