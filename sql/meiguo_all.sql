/*
 Navicat Premium Data Transfer

 Source Server         : MeiguoEdu_pg
 Source Server Type    : PostgreSQL
 Source Server Version : 90603
 Source Host           : localhost:5432
 Source Catalog        : wjm
 Source Schema         : meiguo

 Target Server Type    : PostgreSQL
 Target Server Version : 90603
 File Encoding         : 65001

 Date: 27/07/2017 17:29:36
*/


-- ----------------------------
-- Sequence structure for login_isVisited_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "login_isVisited_seq";
CREATE SEQUENCE "login_isVisited_seq"
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
 START 1
CACHE 1;
SELECT setval('"login_isVisited_seq"', 1, false);

-- ----------------------------
-- Table structure for activity
-- ----------------------------
DROP TABLE IF EXISTS "activity";
CREATE TABLE "activity" (
  "id" uuid NOT NULL DEFAULT NULL PRIMARY KEY,
  "createDate" date NOT NULL DEFAULT NULL,
  "type" varchar COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL,
  "hours" int2 NOT NULL DEFAULT NULL,
  "happi" int2 NOT NULL DEFAULT NULL,
  "detail" jsonb NOT NULL DEFAULT NULL,
  "relation_id" uuid NOT NULL DEFAULT NULL
)
;
COMMENT ON COLUMN "activity"."detail" IS 'include description/name/position';

-- ----------------------------
-- Table structure for login
-- ----------------------------
DROP TABLE IF EXISTS "login";
CREATE TABLE "login" (
  "id" uuid NOT NULL DEFAULT NULL PRIMARY KEY,
  "username" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL,
  "role" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL,
  "password" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL,
  "isvisited" int4 NOT NULL DEFAULT nextval('meiguo."login_isVisited_seq"'::regclass),
  "nickname" varchar(16) COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL
)
;
COMMENT ON COLUMN "login"."id" IS 'MD5 OF EMAIL';
COMMENT ON COLUMN "login"."username" IS 'UNIQUE EMAIL ADDRESS';
COMMENT ON COLUMN "login"."role" IS 'STU/DOE/PMC/FT/ADMIN';

-- ----------------------------
-- Records of login
-- ----------------------------

-- ----------------------------
-- Table structure for relation
-- ----------------------------
DROP TABLE IF EXISTS "relation";
CREATE TABLE "relation" (
  "id" uuid NOT NULL DEFAULT NULL PRIMARY KEY,
  "pmc" uuid DEFAULT NULL,
  "doe" uuid DEFAULT NULL,
  "ft" uuid DEFAULT NULL,
  "stu_id" uuid NOT NULL DEFAULT NULL
)
;
COMMENT ON COLUMN "relation"."id" IS 'should as same as id in student table';

-- ----------------------------
-- Table structure for staff
-- ----------------------------
DROP TABLE IF EXISTS "staff";
CREATE TABLE "staff" (
  "id" uuid NOT NULL DEFAULT NULL PRIMARY KEY,
  "createDate" date NOT NULL DEFAULT NULL,
  "bio" jsonb NOT NULL DEFAULT NULL,
  "relation_id" uuid[] NOT NULL
)
;
COMMENT ON COLUMN "staff"."relation_id" IS 'length can be 0';




-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS "student";
CREATE TABLE "student" (
  "id" uuid NOT NULL DEFAULT NULL PRIMARY KEY,
  "createDate" date NOT NULL DEFAULT NULL,
  "bio" jsonb NOT NULL DEFAULT NULL,
  "hours" integer[] NOT NULL DEFAULT NULL,
  "happi" integer[] NOT NULL DEFAULT NULL,
  "badges" text[] COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL,
  "GPA" jsonb DEFAULT NULL,
  "WMA" jsonb DEFAULT NULL,
  "WYZ" jsonb DEFAULT NULL,
  "VOM" jsonb DEFAULT NULL
)
;

-- ----------------------------
-- Table structure for todo
-- ----------------------------
DROP TABLE IF EXISTS "todo";
CREATE TABLE "todo" (
  "id" uuid NOT NULL DEFAULT NULL PRIMARY KEY,
  "createDate" date NOT NULL DEFAULT NULL,
  "dueDate" date NOT NULL DEFAULT NULL,
  "complete" bool NOT NULL DEFAULT NULL,
  "relation_id" uuid NOT NULL DEFAULT NULL,
  "role" varchar COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL DEFAULT NULL
)
;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "login_isVisited_seq"
OWNED BY "login"."isVisited";
SELECT setval('"login_isVisited_seq"', 2, false);


-- ----------------------------
-- Foreign Keys structure for table activity
-- ----------------------------
ALTER TABLE "activity" ADD CONSTRAINT "r_id" FOREIGN KEY ("relation_id") REFERENCES "relation" ("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- ----------------------------
-- Foreign Keys structure for table relation
-- ----------------------------
ALTER TABLE "relation" ADD CONSTRAINT "staff-doe" FOREIGN KEY ("doe") REFERENCES "staff" ("id") ON DELETE SET NULL ON UPDATE RESTRICT;
ALTER TABLE "relation" ADD CONSTRAINT "staff-ft" FOREIGN KEY ("ft") REFERENCES "staff" ("id") ON DELETE SET NULL ON UPDATE RESTRICT;
ALTER TABLE "relation" ADD CONSTRAINT "staff-pmc" FOREIGN KEY ("pmc") REFERENCES "staff" ("id") ON DELETE SET NULL ON UPDATE RESTRICT;
ALTER TABLE "relation" ADD CONSTRAINT "student" FOREIGN KEY ("stu_id") REFERENCES "login" ("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- ----------------------------
-- Foreign Keys structure for table todo
-- ----------------------------
ALTER TABLE "todo" ADD CONSTRAINT "r_id" FOREIGN KEY ("relation_id") REFERENCES "relation" ("id") ON DELETE CASCADE ON UPDATE RESTRICT;



-- INSERT DATA

BEGIN;
INSERT INTO "login" VALUES ('b967e409-eb43-7131-7c18-728bb4414547', 'jiameng@usc.edu', 'student', 'Wjm21111!', 0, 'harrison');
INSERT INTO "login" VALUES ('adb5055a-73c6-51a0-c350-053cad20234d', 'lisiyuan@usc.edu', 'PMC', 'siyuanli', 2, 'siyuan');
INSERT INTO "login" VALUES ('f9ad9931-87a9-9ea1-9d69-b9a3cd53002b', 'wangharry71@yahoo.com', 'Admin', 'Wjm21111!', 0, 'wjm');
COMMIT;


INSERT INTO "staff" VALUES (
  '01a0acbb-a29f-3988-9f5d-9e48658b10e3','2017-07-27',
  '{"family_name":"li","given_name":"siyuan","preferred_name":"siyuan","gender":"Male","birthday":"1990-05-09","phone":"324432432423","wechat":"siyuan_li","skype":"fdsads","religion":"none","role":"PMC","photo":"./img/4a8a08f09d37b73795649038408b5f33.png","email":"lisiyuan@usc.edu"}',
  '{"8ddf878039b70767c4a5bcf4f0c4f65e","01a0acbb-a29f-3988-9f5d-9e48658b10e5"}');

INSERT INTO "staff" VALUES (
  'f9ad9931-87a9-9ea1-9d69-b9a3cd53002b','2017-07-27',
  '{"family_name":"wang","given_name":"jiameng","preferred_name":"harrison","gender":"Male","birthday":"1993-07-01","phone":"2132967823","wechat":"jiamneng_wang","skype":"fdsads","religion":"none","role":"DOE","photo":"./img/4a8a08f09d37b73795649038408b5f33.png","email":"wangharry71@yahoo.com"}',
  '{"8ddf878039b70767c4a5bcf4f0c4f65e","01a0acbb-a29f-3988-9f5d-9e48658b10e5"}');


INSERT INTO "student" VALUES(
  'b967e409-eb43-7131-7c18-728bb4414547',
  '2017-07-27',
  '{"chinese_name":"wjm","family_name":"wjm","given_name":"wjm","english_name":"wjm","preferred_name":"wjm","gender":"Male","birthday":"1/1/1993","skype":"wjmwjmwjmwjmwjm","school_chinese_name":"wjm","school_chinese_pinyin":"wjm","school_english_name":"wjm","family_bio_siblings":"No","extracurricular_volunteer":"wjm","extracurricular_work":"wjm","extracurricular_education_reason":"Get a job"}',
  '{1,2,3,8,0}',
  '{2,3,4,6,8}',
  '{"b1","c4"}',
  '{"GPA_website":"whwh","GPA_username":"hdgfjh","GPA_password":"hjkh"}'
);

INSERT INTO "relation" ("id", "pmc", "doe", "ft", "stu_id") VALUES ('b967e409-eb43-7131-7c18-728bb4414547', '01a0acbb-a29f-3988-9f5d-9e48658b10e3', 'f9ad9931-87a9-9ea1-9d69-b9a3cd53002b', NULL, 'b967e409-eb43-7131-7c18-728bb4414547');

INSERT INTO "todo" VALUES(
  '33a731343b81270b988b118cb04ed6bb',
  '2017-07-11',
  '2017-07-11',
  'true',
  'b967e409-eb43-7131-7c18-728bb4414547',
  'student',
  'dsfsdfdsfdsf'
);

INSERT INTO "todo" VALUES(
  '33a731343b81270b988b118cb04ed6b5',
  '2017-07-01',
  '2017-07-11',
  'true',
  'b967e409-eb43-7131-7c18-728bb4414547',
  'PMC',
  'this is todo for pmc'
);


INSERT INTO "activity" VALUES(
  '33a731343b81270b988b118cb04ed6b6',
  '2017-07-01',
  'SKill',
  '2',
  '5',
  '{"name":"dsf","position":"afds","describe":"fdgfdsg"}',
  'b967e409-eb43-7131-7c18-728bb4414547'
);

INSERT INTO "activity" VALUES(
  '33a731343b81270b988b118cb04ed667',
  '2017-08-01',
  'work',
  '0',
  '1',
  '{"name":"adfsd","position":"dafds","describe":"dsaf"}',
  'b967e409-eb43-7131-7c18-728bb4414547'
);
