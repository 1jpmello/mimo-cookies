export const formatCurrency = (val: number) =>
  val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

/**
 * Remove caracteres que quebrariam a formatação da mensagem do WhatsApp
 * (ex.: `{`/`}` usados no template). NÃO é uma sanitização contra XSS — o
 * React já escapa todo texto renderizado via JSX — e não deve ser reaproveitada
 * fora do contexto de montar a mensagem do WhatsApp sem revisão.
 */
export const sanitizeInput = (input: string): string =>
  input.replace(/[<>"'`\\{}]/g, "").trim();
