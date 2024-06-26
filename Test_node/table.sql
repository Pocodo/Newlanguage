create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);
insert into user (name,contactNumber,email,password,status,role) values('Admin','0969256731','admin@gmail.com','admin','true','admin');
create table category(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    primary key(id)
)
create table product(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    categoryId int NOT NULL,
    description varchar(250),
    price int,
    status varchar(50),
    primary key(id),
    foreign key(categoryId) REFERENCES category(id)
)
create table bill(
    id int NOT NULL AUTO_INCREMENT,
    uuid varchar(200) NOT NULL,
    name varchar(255) NOT NULL,
    email varchar(250) NOT NULL,
    contactNumber varchar(20) NOT NULL,
    paymentMethod varchar(20) NOT NULL,
    total int NOT NULL,
    productDetails JSON DEFAULT NULL,
    createdBy int NOT NULL,
    primary key(id),
    foreign key(createdBy) REFERENCES user(id)
)