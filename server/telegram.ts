type TelegramOrderInput = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryNeighborhood?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  dedicatoria?: string;
  items: string;
  subtotal: number;
  total: number;
  notes?: string;
};

type OrderItem = {
  name?: string;
  quantity?: number;
  price?: number;
  adicionales?: {
    cintaMarcada?: boolean;
    tripode?: boolean;
  };
  adicionalesPrice?: number;
};

const MAX_TELEGRAM_MESSAGE_LENGTH = 4096;

function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function safeText(value?: string) {
  const trimmed = value?.trim();
  return trimmed || "—";
}

function formatItems(rawItems: string) {
  try {
    const parsed = JSON.parse(rawItems) as OrderItem[];

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return "• Sin productos detallados";
    }

    return parsed
      .map((item) => {
        const quantity = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
        const extrasPrice = Number(item.adicionalesPrice) || 0;

        const unitTotal = price + extrasPrice;
        const lineTotal = unitTotal * quantity;

        const extras: string[] = [];

        if (item.adicionales?.cintaMarcada) {
          extras.push("Cinta marcada");
        }

        if (item.adicionales?.tripode) {
          extras.push("Trípode");
        }

        const extrasText = extras.length
          ? `\n   Adicionales: ${extras.join(", ")}`
          : "";

        return `• ${quantity} x ${safeText(item.name)} — ${formatCop(lineTotal)}${extrasText}`;
      })
      .join("\n");
  } catch {
    return "• No fue posible leer el detalle de productos";
  }
}

export function buildTelegramOrderMessage(order: TelegramOrderInput) {
  const createdAt = new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  const message = [
    "🌹 NUEVO PEDIDO — MEMORIA FLORAL DELUXE",
    "",
    `🧾 Pedido: ${order.orderNumber}`,
    `🕒 Registrado: ${createdAt}`,
    "",
    "👤 CLIENTE",
    `Nombre: ${safeText(order.customerName)}`,
    `Teléfono: ${safeText(order.customerPhone)}`,
    `Correo: ${safeText(order.customerEmail)}`,
    "",
    "📍 ENTREGA",
    `Dirección / funeraria: ${safeText(order.deliveryAddress)}`,
    `Ciudad / barrio: ${safeText(order.deliveryNeighborhood)}`,
    `Fecha: ${safeText(order.deliveryDate)}`,
    `Hora: ${safeText(order.deliveryTime)}`,
    "",
    "💐 PRODUCTOS",
    formatItems(order.items),
    "",
    `Subtotal: ${formatCop(order.subtotal)}`,
    `💰 TOTAL: ${formatCop(order.total)}`,
    "",
    "💌 Dedicatoria:",
    safeText(order.dedicatoria),
    "",
    "📝 Notas:",
    safeText(order.notes),
  ].join("\n");

  if (message.length <= MAX_TELEGRAM_MESSAGE_LENGTH) {
    return message;
  }

  return `${message.slice(
    0,
    MAX_TELEGRAM_MESSAGE_LENGTH - 40
  )}\n\n… mensaje recortado`;
}

export async function sendTelegramOrderNotification(
  order: TelegramOrderInput
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  // Telegram es opcional.
  // Si falla, el pedido debe seguir creándose normalmente.
  if (!botToken || !chatId) {
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: buildTelegramOrderMessage(order),
          disable_web_page_preview: true,
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");

      console.error(
        `[Telegram] Error ${response.status}: ${body.slice(0, 500)}`
      );

      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "[Telegram] No se pudo enviar la notificación del pedido:",
      error
    );

    return false;
  } finally {
    clearTimeout(timeout);
  }
}
