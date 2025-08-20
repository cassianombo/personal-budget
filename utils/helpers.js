export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

/**
 * Escurece uma cor misturando-a com preto
 * @param {string} color - Cor em formato hex (#RRGGBB)
 * @param {number} percentage - Percentual de escurecimento (0-100)
 * @returns {string} - Cor escurecida em formato hex
 */
export const darkenColor = (color, percentage = 70) => {
  // Remove o # se existir
  const hex = color.replace("#", "");

  // Converte para RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calcula o fator de escurecimento
  const factor = percentage / 100;

  // Mistura com preto (0, 0, 0) mas mantém um pouco da cor original
  const newR = Math.round(r * (1 - factor * 0.8));
  const newG = Math.round(g * (1 - factor * 0.8));
  const newB = Math.round(b * (1 - factor * 0.8));

  // Converte de volta para hex
  const toHex = (n) => {
    const hex = n.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
};

/**
 * Cria um tom muito escuro de uma cor, quase preto mas mantendo a identidade
 * @param {string} color - Cor em formato hex (#RRGGBB)
 * @returns {string} - Cor muito escura em formato hex
 */
export const veryDarkColor = (color) => {
  // Remove o # se existir
  const hex = color.replace("#", "");

  // Converte para RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Cria um tom escuro mas harmonioso (75% escuro) mantendo a identidade da cor
  const newR = Math.round(r * 0.25);
  const newG = Math.round(g * 0.25);
  const newB = Math.round(b * 0.25);

  // Converte de volta para hex
  const toHex = (n) => {
    const hex = n.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
};
