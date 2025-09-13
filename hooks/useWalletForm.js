import { useCallback, useEffect, useState } from "react";

const useWalletForm = (wallet, settings, isEditing, visible) => {
  // Safe defaults
  const getSafeDefaults = useCallback(() => {
    const icons = settings.icons || [];
    const backgrounds = settings.backgrounds || [];
    const types = settings.types || [];

    return {
      icon: icons[0] || "",
      background: backgrounds[0] || "",
      type: types[0] || "",
    };
  }, [settings]);

  // Initial form state
  const [formData, setFormData] = useState({
    name: "",
    balance: "",
    ...getSafeDefaults(),
  });

  const [errors, setErrors] = useState({});

  // Initialize form when modal opens or wallet changes
  useEffect(() => {
    if (!visible) return;

    const defaults = getSafeDefaults();

    if (isEditing && wallet) {
      // Editing existing wallet
      setFormData({
        name: wallet.name || "",
        balance: wallet.balance ? wallet.balance.toString() : "0",
        type: wallet.type || defaults.type,
        icon: wallet.icon || defaults.icon,
        background: wallet.background || defaults.background,
      });
    } else {
      // Creating new wallet
      setFormData({
        name: "",
        balance: "",
        ...defaults,
      });
    }

    setErrors({});
  }, [visible, wallet, isEditing, getSafeDefaults]);

  // Form actions
  const updateField = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Wallet name is required";
    }

    if (formData.balance && isNaN(parseFloat(formData.balance))) {
      newErrors.balance = "Balance must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    const defaults = getSafeDefaults();
    setFormData({
      name: "",
      balance: "",
      ...defaults,
    });
    setErrors({});
  }, [getSafeDefaults]);

  return {
    formData,
    errors,
    updateField,
    validateForm,
    resetForm,
  };
};

export default useWalletForm;
