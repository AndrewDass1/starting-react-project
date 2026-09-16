export function isValidTodoTitle(title) {
  const trimmed = title.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Title is required.' };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: 'Title must be 50 characters or fewer.' };
  }

  return { valid: true, error: '' };
}

