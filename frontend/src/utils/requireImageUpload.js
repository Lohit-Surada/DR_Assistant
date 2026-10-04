export function requireImageUpload({ uploadedImage, featureName, onOpenModal, navigate, path }) {
  if (!uploadedImage) {
    onOpenModal(featureName);
    return false;
  }

  if (navigate && path) {
    navigate(path);
  }

  return true;
}
