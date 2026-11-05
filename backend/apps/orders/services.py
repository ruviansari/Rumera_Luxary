import logging
import urllib.parse
from decimal import Decimal
from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def generate_invoice_html(order):
    """
    Renders an editorial royal tax invoice for Rumera Luxury Atra.
    """
    items_html = ""
    for item in order.items.all():
        items_html += f"""
        <tr style="border-bottom: 1px solid #EFEAE0;">
            <td style="padding: 12px 0; font-family: Georgia, serif; color: #14231F;">
                <strong>{item.product_name_snapshot}</strong><br>
                <span style="font-size: 12px; color: #7E9187;">Size: {item.variant_size_snapshot} | SKU: {item.sku_snapshot}</span>
            </td>
            <td style="padding: 12px 0; text-align: center; color: #14231F;">{item.quantity}</td>
            <td style="padding: 12px 0; text-align: right; color: #14231F;">₹{item.unit_price}</td>
            <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #14231F;">₹{item.line_total}</td>
        </tr>
        """

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Invoice - {order.order_number}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F4EC; margin: 0; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #B78B45; border-radius: 8px; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
            <div style="text-align: center; border-bottom: 2px solid #B78B45; padding-bottom: 20px; margin-bottom: 24px;">
                <div style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #B78B45; font-weight: bold;">Maison Rumera Luxury Atra</div>
                <h1 style="font-family: Georgia, serif; font-size: 26px; color: #14231F; margin: 6px 0;">Official Tax Invoice & Provenance</h1>
                <p style="font-size: 13px; color: #5C6B63; margin: 0;">Royal Awadh Atelier • Handcrafted Indian Attars</p>
            </div>

            <table style="width: 100%; font-size: 13px; margin-bottom: 24px;">
                <tr>
                    <td style="vertical-align: top; width: 50%;">
                        <strong style="color: #B78B45; text-transform: uppercase; font-size: 11px;">Consignee Details:</strong><br>
                        <strong>{order.recipient_name}</strong><br>
                        {order.address_line1}<br>
                        {order.address_line2 or ''}<br>
                        {order.city}, {order.state} - {order.postal_code}<br>
                        Phone: {order.phone}<br>
                        Email: {order.email}
                    </td>
                    <td style="vertical-align: top; text-align: right; width: 50%;">
                        <strong style="color: #B78B45; text-transform: uppercase; font-size: 11px;">Order Credentials:</strong><br>
                        Invoice #: <strong>{order.order_number}</strong><br>
                        Date: {order.created_at.strftime('%d %b %Y, %I:%M %p')}<br>
                        Payment: <strong>{order.get_payment_method_display()}</strong> ({order.get_status_display()})<br>
                        Status: <span style="background: #14231F; color: #D4AF37; padding: 2px 8px; border-radius: 4px; font-size: 11px;">VERIFIED</span>
                    </td>
                </tr>
            </table>

            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
                <thead>
                    <tr style="border-bottom: 2px solid #14231F; color: #14231F; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">
                        <th style="text-align: left; padding: 8px 0;">Flacon Selection</th>
                        <th style="text-align: center; padding: 8px 0;">Qty</th>
                        <th style="text-align: right; padding: 8px 0;">Rate</th>
                        <th style="text-align: right; padding: 8px 0;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {items_html}
                </tbody>
            </table>

            <table style="width: 100%; font-size: 13px; margin-bottom: 24px;">
                <tr>
                    <td style="width: 60%;"></td>
                    <td style="width: 40%;">
                        <table style="width: 100%;">
                            <tr>
                                <td style="color: #5C6B63; padding: 4px 0;">Subtotal:</td>
                                <td style="text-align: right; font-weight: 600;">₹{order.subtotal}</td>
                            </tr>
                            <tr>
                                <td style="color: #5C6B63; padding: 4px 0;">Privilege Discount:</td>
                                <td style="text-align: right; color: #2E6B4F; font-weight: 600;">-₹{order.discount_amount}</td>
                            </tr>
                            <tr>
                                <td style="color: #5C6B63; padding: 4px 0;">Insured Express Courier:</td>
                                <td style="text-align: right; font-weight: 600;">₹{order.shipping_amount}</td>
                            </tr>
                            <tr style="border-top: 2px solid #14231F;">
                                <td style="padding: 8px 0; font-family: Georgia, serif; font-size: 16px; font-weight: bold; color: #14231F;">Grand Total:</td>
                                <td style="text-align: right; font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: #14231F;">₹{order.total_amount}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <div style="background-color: #FCFAF6; border: 1px solid #E5DFC9; border-radius: 6px; padding: 14px; font-size: 12px; color: #5C6B63; text-align: center; margin-bottom: 20px;">
                <strong>Authenticity Guarantee:</strong> Every flacon is filled, certified and sealed at the atelier of Master Perfumer Er. Rumana Ansari. 100% Non-Alcoholic pure perfume extrait.
            </div>

            <div style="text-align: center; font-size: 11px; color: #7E9187; border-top: 1px solid #EFEAE0; padding-top: 16px;">
                For direct atelier inquiries: <strong>+91 9305988767</strong> | <strong>ruviansari144@gmail.com</strong><br>
                Maison Rumera Luxury Atra • The Fragrance of Royalty
            </div>
        </div>
    </body>
    </html>
    """
    return html


def generate_whatsapp_order_link(order):
    """
    Builds a pre-filled WhatsApp confirmation URL for atelier orders.
    """
    item_lines = ", ".join([f"{item.product_name_snapshot} ({item.variant_size_snapshot} x{item.quantity})" for item in order.items.all()])
    msg = (
        f"👑 *Maison Rumera Luxury Atra — Order Confirmation*\n\n"
        f"Order Ref: *{order.order_number}*\n"
        f"Customer: *{order.recipient_name}* ({order.phone})\n"
        f"Delivery To: {order.city}, {order.state} ({order.postal_code})\n\n"
        f"Flacons: {item_lines}\n"
        f"Total Paid: *₹{order.total_amount}* ({order.get_payment_method_display()})\n\n"
        f"Thank you for acquiring artisanal fragrance from Er. Rumana Ansari Atelier."
    )
    encoded = urllib.parse.quote(msg)
    return f"https://wa.me/919305988767?text={encoded}"


def send_order_notifications(order):
    """
    Dispatches automated email invoice to customer and founder.
    """
    try:
        subject = f"👑 Order Confirmed: #{order.order_number} — Maison Rumera Luxury Atra"
        html_content = generate_invoice_html(order)
        plain_content = f"Thank you for acquiring fragrance from Maison Rumera. Your order #{order.order_number} for ₹{order.total_amount} is confirmed."

        recipient_list = [order.email]
        # Copy to founder
        founder_email = "ruviansari144@gmail.com"
        if founder_email not in recipient_list:
            recipient_list.append(founder_email)

        send_mail(
            subject=subject,
            message=plain_content,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'ruviansari144@gmail.com'),
            recipient_list=recipient_list,
            html_message=html_content,
            fail_silently=True,
        )
        logger.info(f"Dispatched invoice notification for Order {order.order_number} to {recipient_list}")
    except Exception as e:
        logger.warning(f"Could not send email notification for {order.order_number}: {e}")
