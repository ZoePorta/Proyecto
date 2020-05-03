drop database if exists web;

create database web;
use web;

create table users (
id int unsigned primary key auto_increment,
email varchar(50) not null unique,
photo varchar(255),
first_name varchar(50),
last_name varchar(50),
password varchar(50),
birth_date date,
vendor boolean,
creation_date datetime,
mod_date datetime
);

create table adresses (
id int unsigned primary key auto_increment,
users_id int unsigned,
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
constraint FK_adresses_users FOREIGN KEY (users_id) references users(id)
);

create table shops (
id int unsigned primary key auto_increment,
users_id int unsigned,
name varchar(100),
description text(500),
video varchar(255),
twitter varchar(255),
instagram varchar(255),
facebook varchar(255),
promoted boolean,
creation_date datetime,
mod_date datetime,
constraint FK_shops_users FOREIGN KEY (users_id) references users(id)
);


create table products (
id int unsigned primary key auto_increment,
shops_id int unsigned,
category varchar(50),
name varchar(50),
price decimal(7,2),
stock smallint,
availability enum ('not_available', 'available', 'custom') not null default 'not_available',
description text(500),
color varchar(255),
creation_date datetime,
mod_date datetime,
constraint FK_products_shops FOREIGN KEY (shops_id) references shops(id)
);

create table photos (
id int unsigned primary key auto_increment,
products_id int unsigned,
path varchar(255),
constraint FK_photos_products FOREIGN KEY (products_id) references products(id)
);

create table orders (
id int unsigned primary key auto_increment,
users_id int unsigned,
finished boolean,
sell_date datetime,
creation_date datetime,
mod_date datetime,
constraint FK_oreders_users foreign key (users_id) references users(id)
);


create table orders_products (
id int primary key auto_increment,
orders_id int unsigned,
products_id int unsigned,
price decimal(7,2),
quantity smallint,
constraint FK_oreders_products_orders foreign key (orders_id) references orders(id),
constraint FK_orders_products_products foreign key (products_id) references products(id)
);

create table wishlist (
id int primary key auto_increment,
users_id int unsigned,
products_id int unsigned,
creation_date datetime,
mod_date datetime,
constraint FK_wishlist_users foreign key (users_id) references users(id),
constraint FK_wishlist_products foreign key (products_id) references products(id)
);

create table ratings (
id int unsigned primary key auto_increment,
users_id int unsigned,
products_id int unsigned,
rating decimal (2,1),
comment varchar(255),
constraint FK_ratings_users FOREIGN KEY (users_id) references users(id),
constraint FK_rating_products FOREIGN KEY (products_id) references products(id)
);




