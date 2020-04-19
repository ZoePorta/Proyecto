drop database if exists web;

create database web;
use web;

create table users (
PK_users int unsigned primary key auto_increment,
email varchar(50) not null unique,
photo varchar(255),
first_name varchar(50),
last_name varchar(50),
password varchar(50),
birth_date date,
creation_date datetime,
mod_date datetime
);

create table adresses (
PK_adresses int unsigned primary key auto_increment,
PK_users int unsigned,
name varchar(255),
row1 varchar(255),
row2 varchar(255),
city varchar(255),
PC mediumint,
country varchar(100),
prefix varchar(4),
tlf int,
creation_date datetime,
mod_date datetime,
constraint FK_adresses_users FOREIGN KEY (PK_users) references users(PK_users)
);

create table shops (
PK_shops int unsigned primary key auto_increment,
PK_users int unsigned,
name varchar(100),
description text(500),
video varchar(255),
twitter varchar(255),
instagram varchar(255),
facebook varchar(255),
promoted boolean,
creation_date datetime,
mod_date datetime,
constraint FK_shops_users FOREIGN KEY (PK_users) references users(PK_users)
);


create table products (
PK_products int unsigned primary key auto_increment,
PK_shops int unsigned,
category varchar(50),
name varchar(50),
price decimal(7,2),
stock smallint,
availability enum ('not_available', 'available', 'custom') not null default 'not_available',
description text(500),
color varchar(255),
creation_date datetime,
mod_date datetime,
constraint FK_products_shops FOREIGN KEY (PK_shops) references shops(PK_shops)
);

create table photos (
PK_photos int unsigned primary key auto_increment,
PK_products int unsigned,
path varchar(255),
constraint FK_photos_products FOREIGN KEY (PK_products) references products(PK_products)
);

create table orders (
PK_orders int unsigned primary key auto_increment,
PK_users int unsigned,
finished boolean,
sell_date datetime,
creation_date datetime,
mod_date datetime,
constraint FK_oreders_users foreign key (PK_users) references users(PK_users)
);


create table orders_products (
PK_orders_products int primary key auto_increment,
PK_orders int unsigned,
PK_products int unsigned,
price decimal(7,2),
quantity smallint,
constraint FK_oreders_products_orders foreign key (PK_orders) references orders(PK_orders),
constraint FK_orders_products_products foreign key (PK_products) references products(PK_products)
);

create table wishlist (
PK_wishlist int primary key auto_increment,
PK_users int unsigned,
PK_products int unsigned,
creation_date datetime,
mod_date datetime,
constraint FK_wishlist_users foreign key (PK_users) references users(PK_users),
constraint FK_wishlist_products foreign key (PK_products) references products(PK_products)
);

create table ratings (
PK_ratings int unsigned primary key auto_increment,
PK_users int unsigned,
PK_products int unsigned,
rating decimal (2,1),
constraint FK_ratings_users FOREIGN KEY (PK_users) references users(PK_users),
constraint FK_rating_products FOREIGN KEY (PK_products) references products(PK_products)
);




