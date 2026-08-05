CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerPhone` varchar(64) NOT NULL,
	`customerEmail` varchar(320),
	`deliveryAddress` text NOT NULL,
	`deliveryNeighborhood` varchar(255),
	`deliveryDate` varchar(64),
	`deliveryTime` varchar(64),
	`dedicatoria` text,
	`items` text NOT NULL,
	`subtotal` decimal(12,2) NOT NULL,
	`total` decimal(12,2) NOT NULL,
	`status` enum('pending','confirmed','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products` ADD `extraImages` text;--> statement-breakpoint
ALTER TABLE `products` ADD `includes` text;