--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3 (Debian 14.3-1.pgdg110+1)
-- Dumped by pg_dump version 14.3 (Debian 14.3-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: backups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.backups (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    path text NOT NULL,
    type text NOT NULL,
    description text,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" date DEFAULT '2024-06-21'::date NOT NULL,
    "updatedAt" date DEFAULT '2024-06-21'::date NOT NULL
);


ALTER TABLE public.backups OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "parentId" uuid,
    name text NOT NULL,
    description text,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    images text[] DEFAULT '{}'::text[] NOT NULL,
    "createdAt" date DEFAULT '2024-06-21'::date NOT NULL,
    "updatedAt" date DEFAULT '2024-06-21'::date NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: product_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category (
    "productId" uuid NOT NULL,
    "categoryId" uuid NOT NULL
);


ALTER TABLE public.product_category OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    price double precision,
    "promotionalPrice" double precision,
    description text,
    stock integer DEFAULT 9999 NOT NULL,
    images text[] DEFAULT '{}'::text[] NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" date DEFAULT '2024-06-21'::date NOT NULL,
    "updatedAt" date DEFAULT '2024-06-21'::date NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Data for Name: backups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.backups (id, name, path, type, description, "isDeleted", "createdAt", "updatedAt") FROM stdin;
a2349d6a-b53d-4fb0-b6cc-6b89b3d52f2c	backup-2024-06-21T19-43-43-920Z.sql	C:/Users/Santiago/Desktop/Programacion/solyluca/backend/core-api/db/postgresql/backups	POSTGRESQL	Backup generated on 2024-06-21T19:43:45.075Z	t	2024-06-21	2024-06-21
71c22806-aff5-4985-b4d9-5e32467f1488	backup-2024-06-21T19-45-06-374Z.sql	C:/Users/Santiago/Desktop/Programacion/solyluca/backend/core-api/db/postgresql/backups	POSTGRESQL	Backup generated on 2024-06-21T19:45:07.113Z	t	2024-06-21	2024-06-21
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, "parentId", name, description, "isAvailable", "isDeleted", images, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category ("productId", "categoryId") FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, price, "promotionalPrice", description, stock, images, "isAvailable", "isDeleted", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: product_category PK_7e60cbb6e911363b5ff8ed28e85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT "PK_7e60cbb6e911363b5ff8ed28e85" PRIMARY KEY ("productId", "categoryId");


--
-- Name: backups PK_ca30ff369eddfc7dac3b35d0d3c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.backups
    ADD CONSTRAINT "PK_ca30ff369eddfc7dac3b35d0d3c" PRIMARY KEY (id);


--
-- Name: backups UQ_3a988a8a6c5a53f95d3b3f1da83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.backups
    ADD CONSTRAINT "UQ_3a988a8a6c5a53f95d3b3f1da83" UNIQUE (name);


--
-- Name: IDX_559e1bc4d01ef1e56d75117ab9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_559e1bc4d01ef1e56d75117ab9" ON public.product_category USING btree ("categoryId");


--
-- Name: IDX_930110e92aed1778939fdbdb30; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_930110e92aed1778939fdbdb30" ON public.product_category USING btree ("productId");


--
-- Name: product_category FK_559e1bc4d01ef1e56d75117ab9c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT "FK_559e1bc4d01ef1e56d75117ab9c" FOREIGN KEY ("categoryId") REFERENCES public.categories(id);


--
-- Name: product_category FK_930110e92aed1778939fdbdb302; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT "FK_930110e92aed1778939fdbdb302" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: categories FK_9a6f051e66982b5f0318981bcaa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES public.categories(id);


--
-- PostgreSQL database dump complete
--

