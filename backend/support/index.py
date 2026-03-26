"""
Функции для работы с обращениями в поддержку RobuxShop:
- POST / — создать новое обращение (сохранить в БД + отправить email админу)
- GET /list — получить список всех обращений (только для админа)
- POST /status — обновить статус обращения
"""
import json
import os
import psycopg2
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def send_email_notification(ticket_id, username, topic, message):
    admin_email = os.environ.get('ADMIN_EMAIL', '')
    if not admin_email:
        return

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'🎮 RobuxShop — Новое обращение #{ticket_id}'
    msg['From'] = 'noreply@robuxshop.ru'
    msg['To'] = admin_email

    html = f"""
    <html><body style="font-family: Arial, sans-serif; background: #0A0E1A; color: #F8FAFF; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #0F1525; border-radius: 16px; padding: 24px; border: 1px solid rgba(255,215,0,0.2);">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="background: linear-gradient(135deg, #FFD700, #FF6B35); display: inline-block; padding: 8px 20px; border-radius: 20px; color: #0A0E1A; font-weight: bold; font-size: 14px;">
            💎 RobuxShop — Поддержка
          </div>
        </div>
        <h2 style="color: #FFD700; margin-bottom: 4px;">Новое обращение #{ticket_id}</h2>
        <p style="color: #64748b; font-size: 12px; margin-top: 0;">{datetime.now().strftime('%d.%m.%Y %H:%M')}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 10px; background: #141B2E; border-radius: 8px 8px 0 0; color: #94a3b8; width: 120px;">👤 Никнейм</td>
            <td style="padding: 10px; background: #141B2E; border-radius: 8px 8px 0 0; color: #F8FAFF; font-weight: bold;">{username or 'Не указан'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #1A2235; color: #94a3b8;">📋 Тема</td>
            <td style="padding: 10px; background: #1A2235; color: #F8FAFF;">{topic or 'Не указана'}</td>
          </tr>
        </table>
        <div style="background: #141B2E; padding: 16px; border-radius: 8px; border-left: 3px solid #FFD700;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0;">💬 Сообщение:</p>
          <p style="color: #F8FAFF; margin: 0; line-height: 1.6;">{message}</p>
        </div>
        <div style="margin-top: 20px; text-align: center;">
          <p style="color: #475569; font-size: 12px;">Войди в админ-панель на сайте, чтобы ответить на обращение</p>
        </div>
      </div>
    </body></html>
    """

    msg.attach(MIMEText(html, 'html'))

    try:
        with smtplib.SMTP('smtp.poehali.dev', 587, timeout=10) as server:
            server.starttls()
            server.sendmail('noreply@robuxshop.ru', admin_email, msg.as_string())
    except Exception:
        pass


def handler(event: dict, context) -> dict:
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    # ---- CREATE TICKET ----
    if method == 'POST' and not path.endswith('/list') and not path.endswith('/status'):
        body = json.loads(event.get('body') or '{}')
        username = body.get('username', '')
        topic = body.get('topic', '')
        message = body.get('message', '')

        if not message.strip():
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Сообщение не может быть пустым'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f'INSERT INTO {schema}.support_tickets (username, topic, message) VALUES (%s, %s, %s) RETURNING id',
            (username, topic, message)
        )
        ticket_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        send_email_notification(ticket_id, username, topic, message)

        return {
            'statusCode': 200,
            'headers': cors,
            'body': json.dumps({'success': True, 'ticket_id': ticket_id})
        }

    # ---- LIST TICKETS (admin) ----
    if method == 'GET' and path.endswith('/list'):
        admin_password = event.get('headers', {}).get('x-admin-password', '')
        if admin_password != os.environ.get('ADMIN_PASSWORD', ''):
            return {'statusCode': 403, 'headers': cors, 'body': json.dumps({'error': 'Неверный пароль'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f'SELECT id, username, topic, message, status, created_at FROM {schema}.support_tickets ORDER BY created_at DESC LIMIT 100'
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()

        tickets = [
            {'id': r[0], 'username': r[1], 'topic': r[2], 'message': r[3], 'status': r[4], 'created_at': r[5].isoformat()}
            for r in rows
        ]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'tickets': tickets})}

    # ---- UPDATE STATUS (admin) ----
    if method == 'POST' and path.endswith('/status'):
        admin_password = event.get('headers', {}).get('x-admin-password', '')
        if admin_password != os.environ.get('ADMIN_PASSWORD', ''):
            return {'statusCode': 403, 'headers': cors, 'body': json.dumps({'error': 'Неверный пароль'})}

        body = json.loads(event.get('body') or '{}')
        ticket_id = body.get('ticket_id')
        status = body.get('status', 'resolved')

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f'UPDATE {schema}.support_tickets SET status=%s, updated_at=NOW() WHERE id=%s',
            (status, ticket_id)
        )
        conn.commit()
        cur.close()
        conn.close()

        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'success': True})}

    return {'statusCode': 404, 'headers': cors, 'body': json.dumps({'error': 'Not found'})}
