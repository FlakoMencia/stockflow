insert into products
    (id, sku, name, description, category, current_stock, minimum_stock, unit_price, active, created_at, updated_at)
values
    (1, 'LAP-DEL-5420', 'Dell Latitude 5420', 'Business laptop 14-inch display and 16 GB RAM', 'Electronics', 18, 5, 849.99, true, current_timestamp, current_timestamp),
    (2, 'MON-LG-27QHD', 'LG 27-inch QHD Monitor', 'High-resolution office monitor with HDMI and DisplayPort', 'Electronics', 9, 4, 279.50, true, current_timestamp, current_timestamp),
    (3, 'KBD-LOG-MXK', 'Logitech MX Keys Keyboard', 'Wireless illuminated keyboard for productivity workstations', 'Electronics', 14, 6, 119.99, true, current_timestamp, current_timestamp),
    (4, 'DSK-STD-140', 'Adjustable Office Desk', 'Height-adjustable desk with steel frame', 'Furniture', 7, 3, 399.00, true, current_timestamp, current_timestamp),
    (5, 'CHR-ERG-210', 'Ergonomic Office Chair', 'Mesh ergonomic chair lumbar support', 'Furniture', 4, 5, 229.95, true, current_timestamp, current_timestamp),
    (6, 'CAB-2DR-900', 'Two-Drawer File Cabinet', 'Lockable steel cabinet for office records', 'Furniture', 12, 4, 159.75, true, current_timestamp, current_timestamp),
    (7, 'PPR-A4-500', 'A4 Copy Paper Ream', 'White 80 gsm multipurpose copy paper, 500 sheets', 'Office Supplies', 35, 20, 6.49, true, current_timestamp, current_timestamp),
    (8, 'PEN-BIC-BLK12', 'Black Ballpoint Pens', 'Box of 12 medium-point black ink pens', 'Office Supplies', 48, 15, 4.99, true, current_timestamp, current_timestamp),
    (9, 'NTB-MOL-100', 'Hardcover Notebook', 'Ruled hardcover notebook with 100 sheets', 'Office Supplies', 22, 10, 8.25, true, current_timestamp, current_timestamp),
    (10, 'TON-HP-206A', 'HP 206A Black Toner', 'Black toner cartridge for HP LaserJet printers', 'Office Supplies', 3, 6, 86.90, true, current_timestamp, current_timestamp);

insert into movements
    (id, product_id, movement_type, quantity, stock_before, stock_after, reason, occurred_at)
values
    (1, 1, 'IN', 10, 8, 18, 'Initial inventory load', current_timestamp),
    (2, 5, 'OUT', 2, 6, 4, 'Chairs assigned to new workstations', current_timestamp),
    (3, 10, 'OUT', 4, 7, 3, 'Printer supplies issued to operations team', current_timestamp);
