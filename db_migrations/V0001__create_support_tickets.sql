CREATE TABLE IF NOT EXISTS t_p20708393_robux_sales_portal.support_tickets (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100),
  topic VARCHAR(200),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);