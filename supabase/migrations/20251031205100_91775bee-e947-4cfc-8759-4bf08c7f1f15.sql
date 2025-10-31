-- Insert initial stock prices for all active stocks
INSERT INTO public.stock_prices (stock_id, price, volume, high, low, open, close, timestamp)
SELECT 
  s.id as stock_id,
  -- Base prices for different stocks
  CASE s.symbol
    WHEN 'SCOM' THEN 28.50
    WHEN 'EQTY' THEN 52.00
    WHEN 'KCB' THEN 43.75
    WHEN 'COOP' THEN 14.20
    WHEN 'BAT' THEN 385.00
    WHEN 'EABL' THEN 180.00
    WHEN 'ABSA' THEN 15.50
    WHEN 'SBIC' THEN 21.00
    WHEN 'DTB' THEN 71.50
    WHEN 'SCBK' THEN 152.00
    ELSE 50.00
  END as price,
  -- Random volume between 500k and 5M
  (500000 + random() * 4500000)::bigint as volume,
  -- High is price + random up to 5%
  (CASE s.symbol
    WHEN 'SCOM' THEN 28.50
    WHEN 'EQTY' THEN 52.00
    WHEN 'KCB' THEN 43.75
    WHEN 'COOP' THEN 14.20
    WHEN 'BAT' THEN 385.00
    WHEN 'EABL' THEN 180.00
    WHEN 'ABSA' THEN 15.50
    WHEN 'SBIC' THEN 21.00
    WHEN 'DTB' THEN 71.50
    WHEN 'SCBK' THEN 152.00
    ELSE 50.00
  END * (1 + random() * 0.05)) as high,
  -- Low is price - random up to 3%
  (CASE s.symbol
    WHEN 'SCOM' THEN 28.50
    WHEN 'EQTY' THEN 52.00
    WHEN 'KCB' THEN 43.75
    WHEN 'COOP' THEN 14.20
    WHEN 'BAT' THEN 385.00
    WHEN 'EABL' THEN 180.00
    WHEN 'ABSA' THEN 15.50
    WHEN 'SBIC' THEN 21.00
    WHEN 'DTB' THEN 71.50
    WHEN 'SCBK' THEN 152.00
    ELSE 50.00
  END * (1 - random() * 0.03)) as low,
  -- Open price
  (CASE s.symbol
    WHEN 'SCOM' THEN 28.50
    WHEN 'EQTY' THEN 52.00
    WHEN 'KCB' THEN 43.75
    WHEN 'COOP' THEN 14.20
    WHEN 'BAT' THEN 385.00
    WHEN 'EABL' THEN 180.00
    WHEN 'ABSA' THEN 15.50
    WHEN 'SBIC' THEN 21.00
    WHEN 'DTB' THEN 71.50
    WHEN 'SCBK' THEN 152.00
    ELSE 50.00
  END * (1 - random() * 0.02)) as open,
  -- Close price (same as current)
  CASE s.symbol
    WHEN 'SCOM' THEN 28.50
    WHEN 'EQTY' THEN 52.00
    WHEN 'KCB' THEN 43.75
    WHEN 'COOP' THEN 14.20
    WHEN 'BAT' THEN 385.00
    WHEN 'EABL' THEN 180.00
    WHEN 'ABSA' THEN 15.50
    WHEN 'SBIC' THEN 21.00
    WHEN 'DTB' THEN 71.50
    WHEN 'SCBK' THEN 152.00
    ELSE 50.00
  END as close,
  now() as timestamp
FROM public.stocks s
WHERE s.is_active = true;