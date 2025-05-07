export const getAssetUrl = (filename, type = "mechanics_images") => {
  if (!filename) return false;
  return `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/${type}/${filename}`;
};

export const getAssetAudioUrl = (filename, type = "mechanics_audios") => {
  if (!filename) return false;
  return `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/${type}/${filename}`;
};

export const Apple = `70d97e24-abf4-42af-8aa7-779801541372.png`;
export const apAudio = "a1117f70-6dc0-4210-b794-b7d55abfa5c3.mp3";
export const pleAudio = "1b041226-090c-4e4b-bfe4-e9b432e6001a.mp3";
export const appleAudio = "b2a39def-9a1e-4ec3-9793-03d79e3d3d52.mp3";

export const happyImg = "408257c8-af6e-4718-a8a5-be070a195d1e.png";
export const hapAudio = "3503a6ac-800d-4477-85ee-146e6642bcb1.mp3";
export const pyAudio = "d71e9bec-a8aa-4e35-83f0-44bd8a3549bd.mp3";
export const happyAudio = "5992042b-9bf0-4feb-a0e3-b6eb80100c32.mp3";

export const pencilImg = "dfa309a9-713b-4726-b822-d0423c033175.png";
export const penAudio = "3dc789a8-2cbe-4a92-83f1-b41da07ba70e.mp3";
export const cilAudio = "3de1d37d-8b6a-436a-b36f-5843fd6f87c7.mp3";
export const pencilAudio = "1f5163a9-bd4a-4f7b-8625-22c636c6b300.mp3";

export const TigerNewImg = "c6513466-596d-4a47-abff-0c8202c0dc5d.png";
export const tiAudio = "1b38868a-ce4b-491e-b9c6-56a95046db50.mp3";
export const gerAudio = "4e877701-5226-412f-a7b6-382af4e8632b.mp3";
export const tigerAudio = "5f5c440d-f421-4ae5-bc28-d4fb98ad7578.mp3";

export const RocketNewImg = "80b22d32-621f-4f16-b1a2-f428b35c05ef.png";
export const Rock = "73ef03fc-61d5-479d-8ca0-450492a145f0.mp3";
export const Et = "f7053bb9-285f-476c-a525-f0f41869fd49.mp3";
export const RocketS = "dfff31f2-ac9c-4346-a9f7-7042e82d8888.mp3";

export const Basket = "312cdd6d-e995-469a-ba3f-f3b8cbfeccd5.png";
export const Bas = "631cf215-4282-4e62-b116-85cd92d6201e.mp3";
export const Ket = "e095247f-d16a-40bc-8c86-dc9da7a7cdf6.mp3";
export const BasketS = "75ace319-2bdf-4ef2-8bfe-8f99dbc540aa.mp3";

export const DinnerNewImg = "d8ae7f85-9262-434b-a813-5dd07780f7f0.png";
export const dinAudio = "2125b9e8-43b1-42b6-89ea-1c31bc226e5b.mp3";
export const nerAudio = "81c7662b-d041-4e3b-82bc-9ce92d203c86.mp3";
export const dinnerAudio = "c15c8f2b-6d25-4731-a9df-02c2b8a76bb7.mp3";

export const WindowNewImg = "2fc1a46c-7a7b-44de-8f2d-da5a69b6793d.png";
export const winAudio = "8dd8755b-a98c-4d9a-862b-b2663e128fcd.mp3";
export const dowAudio = "722fed44-3add-453e-a8eb-9fa0c1fb8359.mp3";
export const windowAudio = "f9d1fda0-c246-469e-9ea7-c84b646acc98.mp3";

export const MagnetNewImg = "0b2fed44-a12c-4aef-86bb-71aaa9beafb0.png";
export const magAudio = "c265a218-6ba9-427e-b8b5-021d96cf34c5.mp3";
export const netAudio = "680920d5-9f10-4e5c-94b4-892eb8a73639.mp3";
export const magnetAudio = "220a198a-a138-4f29-ac35-382bb58e40df.mp3";

export const TennisNewImg = "171b7425-6f7a-4fe8-8e5c-44f1d6704734.png";
export const tenAudio = "fc2b08a8-d61f-4a23-9ebf-2bf7ca50090e.mp3";
export const nisAudio = "c01a51af-3a03-49ef-94ac-ebd5c4815fd5.mp3";
export const tennisAudio = "2af8a1d3-f69f-4828-9c0c-5d7897892df8.mp3";

export const PictureNewImg = "53373c82-fc09-4fd7-8a86-de9c521697ca.png";
export const picAudio = "88eea860-1980-4cfc-95d4-14b8e97552ff.mp3";
export const tureAudio = "e08d2e91-70b9-41d8-9b2e-ae316cbd41b7.mp3";
export const pictureAudio = "4c34b55a-d1c0-4818-8a05-7d4fbe39cfef.mp3";

export const NumberNewImg = "2dbd9b96-1daa-4a3a-9027-6ff32f81378a.png";
export const numAudio = "30ffa191-c39b-4b35-ad52-cfe1bf970d67.mp3";
export const berAudio = "827d17b0-9c20-459f-b6a3-0d4ab2bc7263.mp3";
export const numberAudio = "6ef92525-dc5e-40ae-8c44-1f84ae72f3d8.mp3";

export const DoctorNewImg = "e03c3dbf-a6a2-4b0c-a5ca-6583c2b22af0.png";
export const docAudio = "636e1eb0-8781-458e-924c-92229352a886.mp3";
export const torAudio = "18c8ed24-82fa-4513-a106-65f19e126b19.mp3";
export const doctorAudio = "5337f05e-d4dc-430d-94ba-b05d15c1c670.mp3";

export const questionPaperImg = "2f34a23b-f983-40ea-8453-76c4e822d85d.png";
export const paAudio = "b4052806-689c-4682-a3c7-ec33949dc248.mp3";
export const perAudio = "b1e57519-8bb2-4e73-a63c-8fd2149376cd.mp3";
export const paperAudio = "b6abcdef-ed3d-4b65-aff8-a0ad1c156df2.mp3";

export const MonkeyNewImg = "54b34af6-ae55-4f37-9b19-fe58723f443f.png";
export const monAudio = "5992d808-23f1-46c2-a4e8-d143cd5ef452.mp3";
export const keyAudio = "163bc77c-5e44-41d7-aa29-548b21b50ab7.mp3";
export const monkeyAudio = "a3ec9f08-d445-417c-baf8-e239df5a271a.mp3";

export const gardenImg = "07c44745-e9e3-4264-9645-3da09b4d66c8.png";
export const garAudio = "ef6ad6aa-55bb-48ae-9997-c3dfe5563988.mp3";
export const denAudio = "7c24cc2d-ef4b-4598-b107-a2a2865cf196.mp3";
export const GardenAudio = "7c83b6e5-d40b-4144-b8e6-5524d31eedb3.mp3";

export const helmetImg = "5a0e821b-b8b4-45b0-980b-bf1b06e9b918.png";
export const helAudio = "95adff22-d860-4b79-851b-955a5b102065.mp3";
export const metAudio = "7d473604-5ac6-4160-8105-78d60a1b4f1b.mp3";
export const helmetAudio = "daafd516-a70a-43da-b150-db1754f0c9c9.mp3";

export const catImage = "1d6ac0b0-7c78-44fa-a577-1fa2eef31352.png";
export const Kit = "21960c5b-f3ca-410c-9c5f-475c24a64be2.mp3";
export const Ten = "ddae48b2-83a1-427e-bfd3-24a0b4953515.mp3";
export const KittenS = "7babb0dc-cca7-4e99-981f-4dc76b970a32.mp3";

export const Jacket = "b6053ca3-e946-4cba-bd2c-0dce36bbdc75.png";
export const Jack = "a2e3c1d1-c223-4e7c-8f86-c52eafe543c0.mp3";

export const JacketS = "99523c92-f5ef-47f6-9c3a-b284ae72ca0c.mp3";

export const pocketImage = "000cab4b-8140-4c59-99f1-520a136c8ed3.png";
export const Pock = "c6a097f4-03c4-40cc-913c-5406b6547fe6.mp3";

export const PocketS = "ef4ab51d-57cf-48bf-8790-b6deeb35a0b5.mp3";

export const boyChildImg = "3c2b2fce-5cb8-4f74-977b-00e25e05a629.png";
export const child = "31665b4f-973c-4fee-b86f-5e86ab4c6f33.png";

export const level14P1OneUAudio = "c0a0b93c-1297-40b2-8e08-ce9c7ff372ea.mp3";
export const level14P1TwoUAudio = "6fe4e201-cc68-440e-904d-41fc6c98f2a8.mp3";
export const level14P1ThreeUAudio = "57d248b9-f332-4b19-baf6-ab5ffe32a469.mp3";
export const level14P1FourUAudio = "88298392-6520-4c80-a7ba-fa7d67511eb1.mp3";
export const level14P1FiveUAudio = "956fe576-5f09-460e-8aed-9ebd05c3280d.mp3";

export const humanImg = "5f0c40da-3004-45ee-af93-f54a90e30836.png";

export const level14P2OneUAudio = "2fddc1b0-6476-407b-8b71-79ad861c162d.mp3";
export const level14P2TwoUAudio = "a5e22e15-6e92-4622-8ddf-d5ba55fb171f.mp3";
export const level14P2ThreeUAudio = "4b29e844-e6f3-4e9c-a768-f9b8ad55cfe2.mp3";
export const level14P2FourUAudio = "fbb3533e-6b8a-49c3-af1e-a17286fa5165.mp3";
export const level14P2FiveUAudio = "77ed3076-0e51-4694-b5c5-0f05618956a4.mp3";
export const level14P2SixUAudio = "be39f831-3afe-4ed0-a6e2-b06bcf44c896.mp3";

export const salesPerson = "538bd172-fe70-4c2b-96a3-cda220afd1d7.png";

export const level14P3OneUAudio = "531bad0a-7242-42f2-978c-295c767b4fbf.mp3";
export const level14P3TwoUAudio = "194c11b3-8b37-4e41-bf5e-182725b3931d.mp3";
export const level14P3ThreeUAudio = "05620c77-206f-4f51-a7b7-2c565da0d32e.mp3";
export const level14P3FourUAudio = "f2237d5a-4ba6-4a81-b68a-dce4dc3db045.mp3";
export const level14P3FiveUAudio = "f583b9cb-bd9b-49c1-b8f7-69135f31ca73.mp3";

export const vegVendor = "2867a995-7791-4c4b-a0a1-08af143503c9.png";

export const level14P4OneUAudio = "23b85b00-e816-4df8-a21d-8af3bd5fcdd3.mp3";
export const level14P4TwoUAudio = "ef38f13a-8ca8-4eab-aa15-5e2c328ed193.mp3";
export const level14P4ThreeUAudio = "92c4c19f-7559-4429-a482-9b4916fe1187.mp3";
export const level14P4FourUAudio = "8df6bb32-acc7-4e7f-b644-11a721da9a10.mp3";
export const level14P4FiveUAudio = "65e03034-1a09-4dc8-b297-bcb5a11bf1c4.mp3";

export const level14S1OneUAudio = "7d7506dc-2e56-4b3f-8607-877cb9eca71c.mp3";
export const level14S1TwoUAudio = "9c5007a8-4a3e-4dc7-bcae-ff526adc7628.mp3";
export const level14S1ThreeUAudio = "520486ce-37f0-4a94-a506-24503ac2c4f3.mp3";
export const level14S1FourUAudio = "270ec417-48b6-466a-b9c6-5995f7061ab4.mp3";
export const level14S1FiveUAudio = "55b362e6-5cb0-4d71-8d8a-e8dde28e0dbd.mp3";

export const level14P5OneUAudio = "c7f4e308-9322-4a82-b638-b03e7bf99eb4.mp3";
export const level14P5TwoUAudio = "b066515f-8de4-43a5-b897-ea972f107e04.mp3";
export const level14P5ThreeUAudio = "7cce7c8c-613a-4594-ac88-01120d21cc66.mp3";
export const level14P5FourUAudio = "16fe7d75-a659-469e-b3b9-6744d4df303d.mp3";
export const level14P5FiveUAudio = "01f66324-dcc3-4dec-9d2f-2306ac814a4e.mp3";

export const level14P6OneUAudio = "42b58efb-ea4d-41cf-88f8-b7e58cf14a92.mp3";
export const level14P6TwoUAudio = "ffde59c4-6938-4c62-aa8b-3b0510301c51.mp3";
export const level14P6TwoUAudio_Alt =
  "9cb94dc9-068d-4cbf-bc5d-a63f778a4c59.mp3";
export const level14P6ThreeUAudio = "23e514e1-4ff5-48b6-83b6-13c89cffbb4a.mp3";
export const level14P6FourUAudio = "c204e318-f99b-44e6-9214-c6c12f8f733b.mp3";
export const level14P6FiveUAudio = "6cabee60-ba74-4a8d-9c03-505ff70de95c.mp3";

export const mother = "ce29c00b-3912-4a12-83db-e0b5e4f081bb.png";

export const level14P7OneUAudio = "31db6a28-95b6-4215-af9a-680666923c7c.mp3";
export const level14P7TwoUAudio = "2bae3904-eff6-4301-ab4c-43f534201fad.mp3";
export const level14P7ThreeUAudio = "c34e1ecb-2f5c-4a60-8cc7-328765e27bee.mp3";
export const level14P7FourUAudio = "1580bf5c-f6c7-428b-b111-eca91b1addaa.mp3";
export const level14P7FiveUAudio = "8da93ed2-c007-4d70-b87e-10e1dbd68b68.mp3";

export const level14P8OneUAudio = "77bc2c33-e292-4592-8f0e-81173739f5d1.mp3";
export const level14P8TwoUAudio = "6c478257-d5ac-489c-a1ee-ca726bf4ae67.mp3";
export const level14P8ThreeUAudio = "eb69eed3-261e-44d6-b699-60aff4f597e9.mp3";
export const level14P8FourUAudio = "128a374f-7efe-48cf-803b-8bdf348e745a.mp3";
export const level14P8FiveUAudio = "749fb6b7-525e-4ec9-9bfa-800d970d6f69.mp3";

export const level14S2OneUAudio = "7bf740ac-1716-4835-bb7c-e94a25dcc29d.mp3";
export const level14S2TwoUAudio = "7048e6ae-e919-460b-9c7f-8532a4846897.mp3";
export const level14S2ThreeUAudio = "46614e00-f981-40f0-bf9e-9945198c0079.mp3";
export const level14S2FourUAudio = "f78ff491-4fb4-4814-9777-33f92b916835.mp3";
export const level14S2FiveUAudio = "f84ad2ad-8d0f-4945-a4f5-c6bfa71c0542.mp3";

export const level12P2CAudio = "476ff83d-74a2-458c-b507-81f8ff0c4328.mp3";
export const level12P6CAudio = "476ff83d-74a2-458c-b507-81f8ff0c4328.mp3";
export const level12P2Audio_1 = "fc4b4dbd-85ed-455f-83aa-683717b0de7a.mp3";
export const level12P2Audio_2 = "5b9d62f0-6970-4718-8f57-619e5d7c1511.mp3";
export const level12P2Audio_3 = "bf89226e-4efb-4af0-b755-7f38f5aff58d.mp3";
export const level12P2Audio_4 = "22793235-a183-486e-9546-33b53a638426.mp3";
export const level12P2Audio_5 = "1e690760-7b19-42d6-a6ab-de6c3af1acdd.mp3";
export const level12P2Audio_6 = "bd771876-1f90-4873-bba7-ab6886c3b24f.mp3";
export const level12P2Audio_7 = "f92697a9-8892-4859-8733-73e90ceeccbd.mp3";
export const level12P2Audio_8 = "ca9d2333-a1b1-4511-a325-f86d96da7f8a.mp3";
export const level12P2Audio_9 = "dd96ecfa-91e7-4d7c-905e-95b34b30a4b7.mp3";
export const level12P2Audio_10 = "11d10c5e-5dc3-47df-911d-dbecc109e744.mp3";
export const level12P2Audio_11 = "ea393674-98eb-4696-a792-a508bd346baf.mp3";

export const level12P7OneAudio = "aebaab88-7f58-4400-8059-d361112e1053.mp3";
export const level12P7TwoAudio = "44ba94b2-b90d-4ec8-91dc-348d4e72027e.mp3";
export const level12P7ThreeAudio = "89992809-84d7-44b8-814b-8659d7184eec.mp3";
export const level12P7FourAudio = "7f2e703b-12ab-475d-888d-6423ea0ba009.mp3";
export const level12P7FiveAudio = "b74da25f-515f-4d1e-93b0-2426dd87ce4b.mp3";

export const patelRoadAudio = "07b4ae4a-b439-4a70-ad00-2dd7b03e7a25.mp3";

export const level12P8OneAudio = "11ceee8d-c0fa-4ce8-a201-57f1ed3d15a5.mp3";
export const level12P8TwoAudio = "5d50468f-5329-4126-90ac-d6d2bc5ec22e.mp3";
export const level12P8ThreeAudio = "6cb89bbd-b0d6-466a-b3e2-a54635624b9a.mp3";
export const level12P8FourAudio = "247f9dbc-fc53-4334-884f-4e3433535bb7.mp3";
export const level12P8FiveAudio = "eabc9a79-3228-4b36-9882-9158f329fc20.mp3";

export const level12P3OneAudio = "a45d43f9-5c2d-4ce0-a326-dd360a2fd32b.mp3";
export const level12P3TwoAudio = "a894822c-9552-4a79-8bfc-1365922a1098.mp3";
export const level12P3ThreeAudio = "8cc34f87-0267-4b52-a15a-85277ea885c7.mp3";
export const level12P3FourAudio = "13693491-22e6-4543-9f31-4f00ff0d296f.mp3";
export const level12P3FiveAudio = "332ca919-c895-4c54-99da-b01ea85e0c12.mp3";

export const level12P4OneAudio = "d3ce289e-369b-4ac9-9822-425488ba23ef.mp3";
export const level12P4TwoAudio = "ab61b415-ba6d-4dfe-8253-d20de582534d.mp3";
export const level12P4ThreeAudio = "a0ea944e-64c1-4a09-ac20-9df84a5e6970.mp3";
export const level12P4FourAudio = "5aea7bb1-17db-4192-9969-c45a7e23df97.mp3";
export const level12P4FiveAudio = "451b5e96-240c-4aab-a5a5-81ea7e4cd34d.mp3";

export const catintroductionAnouncementImg =
  "b0f1311b-c168-4b5b-8664-c2c9d10e96fe.png";
export const level11S2Audio = "b807ce2c-345d-46fc-b7ab-c5aa94c2d4f2.mp3";

export const bf1 = "f91076fd-b3db-4544-8e38-f22664af2a21.png";
export const bf2 = "301f2216-5fa2-4865-bd97-bd9a348c914b.png";

export const level11P7OneUAudio = "ea4488ad-a6f4-4978-a050-0cb0b4471791.mp3";
export const level11P7TwoUAudio = "3ff2581e-291e-4557-b485-b6075c6d858b.mp3";
export const level11P7ThreeUAudio = "f78c4a8d-f701-4c66-9d0f-123391ea982b.mp3";
export const level11P7FourUAudio = "cf821322-e3b3-4005-a613-7c3113c30a49.mp3";
export const level11P7FiveUAudio = "06de2726-72b6-4f90-a657-0158b08e9803.mp3";

export const level11P3OneUAudio = "01b056a8-c53c-4d1a-963d-00322a09af56.mp3";
export const level11P3TwoUAudio = "f12ee26d-dd45-45b8-b88f-cb7b48d860e2.mp3";
export const level11P3ThreeUAudio = "fd146722-76ee-4edd-ab9c-7172e2cd61ab.mp3";
export const level11P3FourUAudio = "de38744a-5035-4a5d-9407-94f1826b7cca.mp3";
export const level11P3FiveUAudio = "1120cdf2-18de-4720-8f86-8979f0fb6c29.mp3";

export const rahulOne = "4eb990fc-c4b8-4920-9c05-cb14c7cf795e.png";
export const rahulTwo = "ed2894a3-3730-4015-a4fa-85133fc6bd9d.png";
export const friendintroductionAnouncementImg =
  "b0f1311b-c168-4b5b-8664-c2c9d10e96fe.png";

export const level11P2Audio = "82be55d5-6110-4b0f-8a20-e7c4dc31f605.mp3";

export const dosaIce1 = "cab22300-541a-41a4-b7f9-bac30e6e455c.png";
export const dosaIce2 = "0d9f19e5-76cc-48df-b9a6-327b57053235.png";
export const SouthIndianAnouncementImg =
  "b0f1311b-c168-4b5b-8664-c2c9d10e96fe.png";

export const level11P1Audio = "8b852dd8-3751-463b-9cda-2ce502317f70.mp3";

export const imageOne = "2afe10e0-4d94-490d-8242-19897849054f.png";
export const imageTwo = "71bd9c0e-e792-48b7-8b4c-1280939f88dc.png";
export const railAnouncementImg = "481e761a-2254-4b7d-967a-36d0484aa2b6.png";

export const chennaiTrainAudio = "3d9f5fc7-1f93-4d9a-94c5-e2ede630447b.mp3";

export const childrenDayImg = "d0d44f26-8bc0-4459-b856-219b4d521dea.png";

export const level10P7OneAudio1 = "fce55dec-a9db-4eba-9e14-4e366a009162.mp3";
export const level10P7OneAudio2 = "055bf8a4-ca6b-4d40-8f5a-df23408ddfd5.mp3";
export const level10P7OneAudio3 = "36a52dd2-0547-4736-b4cf-e72545b9241d.mp3";

export const level10P7TwoAudio1 = "818dd92d-2834-4460-ba95-02612ba440ce.mp3";
export const level10P7TwoAudio2 = "be2bd2b0-016c-4998-9671-96c6d3ff6000.mp3";
export const level10P7TwoAudio3 = "7a481f43-663e-47b5-8208-79643b226119.mp3";

export const level10P7ThreeAudio1 = "41bd4eac-7001-47a5-9e64-a2f023f1b1d5.mp3";
export const level10P7ThreeAudio2 = "e88f33aa-8d12-43c3-9351-5d3efce64892.mp3";
export const level10P7ThreeAudio3 = "ef01bc02-0893-4456-b205-1837c2053541.mp3";

export const level10P7FourAudio1 = "2d075249-11de-471a-91d6-1c92c25431af.mp3";
export const level10P7FourAudio2 = "bba84bb5-df1e-45e9-9099-062bff8ac2a7.mp3";
export const level10P7FourAudio3 = "3a2986c3-e645-41ff-b0ff-380308fc4d91.mp3";

export const level10P7FiveAudio1 = "8d731117-078c-43ae-b976-822111236a97.mp3";
export const level10P7FiveAudio2 = "c94069d5-8c60-4f86-83cf-506026dad8af.mp3";
export const level10P7FiveAudio3 = "7cbbda73-4b24-4ba2-bebb-de9617ba02d3.mp3";

export const imageOneP4 = "80d650bd-e31e-4b12-8a74-ad64d743728d.png";
export const imageTwoP4 = "80d650bd-e31e-4b12-8a74-ad64d743728d.png";
export const imageThree = "481e761a-2254-4b7d-967a-36d0484aa2b6.png";

export const toyTrainAudio = "b8e0e751-7c37-4565-9061-d88640435639.mp3";

export const biharAnouncementImg = "b0f1311b-c168-4b5b-8664-c2c9d10e96fe.png";
export const patna1 = "298866f6-9ece-49cb-a49c-ce7a8ebac06b.png";
export const patna2 = "c79c4d26-816e-40f2-8c8d-4202385a8687.png";

export const reporter1 = "61a59cfe-aeb7-4c55-93d0-66001fe1f46b.png";
export const reporter2 = "94ec9353-5fe5-4d8d-b449-053dbe98d224.png";
export const cycloneAnouncementImg = "b0f1311b-c168-4b5b-8664-c2c9d10e96fe.png";

export const cycloneAudio = "6b753b36-2b5b-49f5-a472-0a5c4f4b358f.mp3";

export const goodtouchImg = "a57d0095-9244-4c8e-874f-939272076dbb.png";

export const level10P7FourAudio2_2 = "7ea239e2-837b-4932-9e52-ff8cb4ef854f.mp3";
export const level10P7FiveAudio3_2 = "51033de5-73f0-4627-b498-12717093e0a1.mp3";
export const level10P7FourAudio3_2 = "430fbecd-8ee8-4486-972e-25f82f42992e.mp3";

export const level10P7ThreeAudio1_2 =
  "75836134-9e85-4587-a6b8-34a1d84c75e8.mp3";
export const level10P7ThreeAudio3_2 =
  "45c73e28-34e0-45fc-aebf-cbb598a15a70.mp3";
export const level10P7FourAudio2_3 = "8e4918d2-638a-4e18-b40e-c43d169675ab.mp3";

export const level10P7FourAudio3_3 = "302d005f-b599-40da-a5c4-b19145398c84.mp3";
export const level10P7FiveAudio3_3 = "cf89bbdc-c974-4c1c-963a-e2fe38d1a67d.mp3";
export const level10P7ThreeAudio3_3 =
  "75836134-9e85-4587-a6b8-34a1d84c75e8.mp3";

export const level10P7ThreeAudio1_3 =
  "575ed5bc-cc99-401d-8a1a-306d48a97a3a.mp3";
export const level10P7ThreeAudio3_4 =
  "75836134-9e85-4587-a6b8-34a1d84c75e8.mp3";
export const level10P7FourAudio2_4 = "8e4918d2-638a-4e18-b40e-c43d169675ab.mp3";

export const gymAudio = "0228d1c0-1b62-4ad8-93f1-6934359516e2.mp3";
export const level10P7FourAudio2_5 = "c1a65608-eac8-414d-9401-569feeea0dc9.mp3";
export const level10P7FourAudio3_4 = "b71db360-4ef7-4937-a336-64b69138b50f.mp3";

export const gradenAnouncementImg = "cd29f151-4e2f-4b94-a9ff-f81ef8f69ea2.png";

export const gardenAnouncementAudio =
  "9ea4b3b4-ef3f-4f9e-a00b-4bef7dcb6c6a.mp3";

export const appleImg = "70d97e24-abf4-42af-8aa7-779801541372.png";
export const starRImg = "c7612b61-5569-4653-9ffe-d19ef47efa0a.png";
export const jugR1OneImg = "6ad6f42e-5612-44a7-80da-60bf2bd8ba4c.png";
export const starRAudio = "2330b2d9-4983-43ab-a49d-7cacfde535da.mp3";

export const sunsetImg = "a1861ef2-5584-4d5d-b79b-b7d1ae5082c8.png";
export const basketImg = "312cdd6d-e995-469a-ba3f-f3b8cbfeccd5.png";
export const spinRImg = "ed5cd7a2-66b1-4421-861d-fb53ed3a392e.png";
export const spinRAudio = "126a8b84-3e24-49ec-94d4-fe2a3699b46c.mp3";

export const skyRImg = "d0194f2e-e620-4c39-b26c-ce37e715c728.png";
export const bagR1TwoImg = "d9bd8675-8e49-43d0-b2c3-cd005e58723c.png";
export const bagR1ThreeImg = "14d4d46b-b269-436c-bf92-1b0655b14dbb.png";
export const skyRAudio = "0ec9f86d-e0fc-4ebe-9d25-56b81820acff.mp3";

export const capR1TwoImg = "e514e897-2dc3-4fce-87e1-0a738349e174.png";
export const treeRImg = "263197ac-0043-4107-b97b-0dd84318bc62.png";
export const capR1ThreeImg = "c30c305b-1451-45e5-9fb5-1b3e0ffbbec2.png";
export const treeRAudio = "1f1492b3-2cb8-44ae-9fcc-3fb3e7103f83.mp3";

export const dragonRImg = "6224d1b7-4b9c-4b15-82f1-0a32853581bc.png";
export const dogR1TwoImg = "cea58cbd-73bc-4b94-a4c8-5904ec10612a.png";
export const dogR1ThreeImg = "6173c4f1-51d2-4e6d-8a7a-35b3d80aaeba.png";
export const dragonRAudio = "de3d2baf-d919-4cea-9390-3ca778c9f62c.mp3";

export const eggR1TwoImg = "cf55fb7a-21f4-4e45-ad34-99f7fb77f2cc.png";
export const oilRImg = "83c24929-462b-4183-981c-dc3dd6446fa3.png";
export const eggR1ThreeImg = "796fb5e5-006f-4a8e-ab3b-697b471d8c1b.png";
export const oilRAudio = "8bf4db27-d13b-4995-ada6-25e62cdacd2c.mp3";

export const streetRImg = "14ba16e2-c0ea-4a7e-a74f-141b35ae8cd2.png";
export const fanR1TwoImg = "c087addb-b437-4a4a-8722-ef3acd311df2.png";
export const fanR1ThreeImg = "";
export const streetRAudio = "0a16bf2a-201d-4f6f-a659-7f8bb25a46cb.mp3";

export const pantherRImg = "0812d2e4-c981-4b60-8b61-61464ca73751.png";
export const hatR1TwoImg = "8932732b-15a7-4ced-adfe-c12da37cccb9.png";
export const hatR1ThreeImg = "e8a8b105-2e74-40c3-a522-2154fc8683d5.png";
export const pantherRAudio = "9ddf2dce-4492-465b-87d6-2997b8369d27.mp3";

export const shopImg = "6c8076bd-456b-4db9-af09-8fa97cf7181c.png";
export const listenRImg = "d1ee80cc-527c-45ea-b681-0a7e48dca89d.png";
export const pillowR1ThreeImg = "8f599207-cb9b-43fc-a5ab-f25e961ee3a7.png";
export const listenRAudio = "8ca34e18-c06f-4986-bddd-8bbfc7a8dd4a.mp3";

export const threeRImg = "53226804-e68a-4f52-97ea-460217c1e166.png";
export const ropeR1OneImg = "36ed39d3-3c97-4059-85d5-290c770df87c.png";
export const ropeR1ThreeImg = "bc63dc09-027a-4054-be26-92cc7b551f5b.png";
export const threeRAudio = "27e57622-4b64-42da-8a85-f337ffe10d10.mp3";

export const drawRImg = "76caa169-ebb1-48fa-a83a-bc71590fb7d8.png";

export const drawRAudio = "ba5bd6d6-d8b2-4b8a-b4ab-13bee94eac9b.mp3";

export const scratchRImg = "b768c75c-1fd0-4bf4-94b1-24265b2e8a89.png";
export const scratchRAudio = "aeee617f-33e3-4209-8687-be9482374697.mp3";

export const treasureRImg = "32a16c24-930e-4b22-8481-cc6cf0234b2b.png";

export const treasureRAudio = "449af00f-c148-44b8-84d3-71b45e45ef2a.mp3";

export const deskRImg = "8a6beea7-a0e5-439b-ade2-842b6b56af12.png";
export const deskRAudio = "f9f0b470-eac2-4ebd-99bf-84fb01b262e6.mp3";

export const fanR1OneImg = "b9eb8dfc-0b28-4e49-8f83-cdc1135a1447.png";
export const shoutRImg = "eb944944-ade7-464c-9566-a0fa4585c731.png";
export const shoutRAudio = "cc908f60-f082-4838-9343-d97db30cad06.mp3";

//export const shopImg = "6c8076bd-456b-4db9-af09-8fa97cf7181c.png";
export const whaleRImg = "cf68be78-d67e-4a5a-a065-85eea356c13f.png";
//export const pillowR1ThreeImg = "8f599207-cb9b-43fc-a5ab-f25e961ee3a7.png";
export const whaleRAudio = "e10e3687-fb63-4989-98d3-f972f29c5064.mp3";

export const aimRImg = "b1eb5874-5de3-4c02-ae37-433c96efa059.png";
//export const ropeR1OneImg = "36ed39d3-3c97-4059-85d5-290c770df87c.png";
//export const ropeR1ThreeImg = "bc63dc09-027a-4054-be26-92cc7b551f5b.png";
export const aimRAudio = "3686760d-c8d1-4c4b-9762-1fb570f073f5.mp3";

export const boatRImg = "4850effe-47a4-40d5-b13e-3524d014972d.png";
//export const bagR1TwoImg = "d9bd8675-8e49-43d0-b2c3-cd005e58723c.png";
//export const bagR1ThreeImg = "14d4d46b-b269-436c-bf92-1b0655b14dbb.png";
export const boatRAudio = "6f4b0e65-dbed-41ad-a676-78b4784d1f20.mp3";

//export const capR1TwoImg = "e514e897-2dc3-4fce-87e1-0a738349e174.png";
export const phoneRImg = "c5ea8394-5db7-42b6-b70a-893c2da58337.png";
//export const capR1ThreeImg = "c30c305b-1451-45e5-9fb5-1b3e0ffbbec2.png";
export const phoneRAudio = "441df672-e8ae-4cd5-bef5-5eaae9c65b3a.mp3";

export const orangeRImg = "0c8d1a4f-c2ec-4b4c-9c13-d3b2a11b9b85.png";
//export const dogR1TwoImg = "cea58cbd-73bc-4b94-a4c8-5904ec10612a.png";
//export const dogR1ThreeImg = "6173c4f1-51d2-4e6d-8a7a-35b3d80aaeba.png";
export const orangeRAudio = "897f476e-10b3-4c05-ae26-52a5572f5479.mp3";

//export const eggR1TwoImg = "cf55fb7a-21f4-4e45-ad34-99f7fb77f2cc.png";
export const clockRImg = "f1436985-91ff-4a5d-b73d-1f01829e7b0e.png";
//export const eggR1ThreeImg = "796fb5e5-006f-4a8e-ab3b-697b471d8c1b.png";
export const clockRAudio = "0741e03e-5d64-44d5-af81-d911b2b4e9c0.mp3";

//export const fanR1OneImg = "b9eb8dfc-0b28-4e49-8f83-cdc1135a1447.png";
export const flowerRImg = "6f6bad72-035f-4f55-8e5d-e9ba7ee725b8.png";
//export const fanR1ThreeImg = "9e79a2d8-5133-4959-94a0-3b200ba1b92a.png";
export const flowerRAudio = "fe29fced-12d9-4e6a-b515-988c392636a3.mp3";

export const glassRImg = "b658a334-9405-489c-aa92-8a3879b9e452.png";
export const glassRAudio = "fadeb164-73fc-4953-a221-4d1d1405ae8d.mp3";

export const plantRImg = "78239c74-fc62-4e1f-b455-910d42313f65.png";
export const plantRAudio = "773719b0-b15e-4ef1-9414-41a15a5c6f65.mp3";

export const sleepRImg = "f2a51f1d-a6a5-4ce7-b759-e04b80b37989.png";
export const sleepRAudio = "4ca30e98-34b8-46dd-8f05-d260bbbff3da.mp3";

export const elephantRImg = "d4a75e05-6487-4b26-b9a7-d52f3123548e.png";
export const elephantRAudio = "2bc57efc-f252-48bc-b38e-cebef695a53b.mp3";

export const muscleRImg = "3341d761-6fd8-4aff-a2b1-8f09dde91f0f.png";
export const muscleRAudio = "054bd0c2-b095-4a34-ba41-3a409ae16394.mp3";

export const fieldRImg = "7577cf1f-b9d7-4d81-89b3-99aa42018a62.png";
export const fieldRAudio = "dd59cd48-04bf-480d-95af-32ad333ca707.mp3";

export const bicycleRImg = "dc8b7110-ac90-4f0a-a1b7-3e638f187479.png";
export const bicycleRAudio = "f2cbf13c-8c8f-44c5-ba99-a9929602c746.mp3";

export const mathsRImg = "efed2710-61bf-4d70-a71f-c673e483d20d.png";
export const mathsRAudio = "650db46c-d24f-45e5-9156-1e9bf1296089.mp3";

export const panRImg = "409081fb-b8ad-49ad-9567-fe460fc533c0.png";
export const panRAudio = "94b2d507-3adf-4e08-b334-579aa68ad795.mp3";
export const dogR1OneAudio = "2566aef0-9adb-40a0-af70-8a08844e227c.mp3";
export const capR1OneAudio = "452e865d-f4e1-4deb-8fb8-5ce6f21af966.mp3";
export const eggR1OneAudio = "4bf35d1b-36cb-4991-a2de-d0dc1e2b09ac.mp3";
export const batRAudio = "5b47db8f-527a-412d-b07e-336521eec5c3.mp3";
export const nestR1OneAudio = "892c5ec9-96f9-4686-9431-0445c83ee5fa.mp3";
export const puzzleRImg = "bc5f2ff9-23e0-4c78-9faf-187475f3e0f2.png";
export const ropeR1OneAudio = "f9fe157c-409c-4b41-860a-8e8489922cb1.mp3";
export const puzzleRAudio = "08a863f3-0014-459d-bd23-9eae2497924a.mp3";
export const lemonRImg = "8dc4f4fb-d8c4-42b1-b67d-7b77279ab1c3.png";
export const vanR1OneAudio = "0d2ce58c-2c4c-43b9-8548-bbdb36698c05.mp3";
export const lemonRAudio = "da93ccda-ec06-44af-8996-0cc6db1afb87.mp3";
export const bellR1OneAudio = "a98957c7-4356-488a-a8a8-df18793160ec.mp3";
export const kingRImg = "77201bae-ad45-4d72-85e7-801a1cd25459.png";
export const kingRAudio = "d9f6f612-5836-4df1-8c9b-7bed79167a70.mp3";
export const ladderRImg = "6bb722d3-3247-4aae-87f7-70c7cb896406.png";
export const maskR1OneAudio = "0dac8950-5b80-4615-a7ed-876b775b467e.mp3";
export const jugR1OneAudio = "8601e893-a55b-4709-acbe-3d3295876aac.mp3";
export const ladderRAudio = "dfc37247-5945-4ee5-a2e9-74f3ff371a85.mp3";
export const drumRImg = "ed6cff75-9f68-4650-b8d8-6cc0ec71f48a.png";
export const goatR1OneAudio = "2b66908b-8703-4384-b79b-9447f0eea3c7.mp3";
export const fanR1OneAudio = "36949692-19c2-49b1-9906-1a117c17c0d1.mp3";
export const drumRAudio = "79996f35-3fef-4f3f-822b-15716f358838.mp3";
export const coffeeRImg = "781044e0-6a89-4b08-acfc-222da83d394a.png";
export const coffeeRAudio = "3c27e9b5-cd13-418d-ac4b-7564744ed92f.mp3";
export const appleR1OneAudio = "d09312d4-4ab1-4845-8d6f-fbd61f83918e.mp3";
export const busRImg = "665edd0d-5d8a-40a7-86d2-ebfad3e80def.png";
export const cardRAudio = "28ed10c2-1b11-4e6a-8d19-3a167dc9c681.mp3";
export const graphRAudio = "b9dcd534-fa1a-4fdc-912a-0dd3aa69132b.mp3";
export const ovenRImg = "c27afb27-799c-441c-b402-6bece3b361d9.png";
export const ovenRAudio = "e3a15d5f-e663-4888-8dce-9b797b4d9c37.mp3";
export const tableRImg = "c087addb-b437-4a4a-8722-ef3acd311df2.png";
export const tableRAudio = "1310fd30-ea87-4cd2-8a88-d4b9dbe690c7.mp3";
//export const basketRImg = "312cdd6d-e995-469a-ba3f-f3b8cbfeccd5.png";
//export const basketRAudio = "9c2208a4-6c4e-4c62-9439-00d5856fce24.mp3";
export const cardRImg = "df09a81f-a39c-4eb0-b254-4ad8e7765932.png";
export const frogRImg = "20ec0cf5-ea8a-434b-afab-a929fa08690c.png";
export const frogRAudio = "bb789538-f1f4-44cb-b19c-9c36714eefef.mp3";

//export const appleImg = "70d97e24-abf4-42af-8aa7-779801541372.png";
export const dogsBarkImg = "0012d4ce-4413-496e-814f-db47e408f1b5.png";
export const hatR1OneImg = "8a10681a-9205-4cf4-b4c8-1fa505f50f08.png";
export const appleNewAudio = "b2a39def-9a1e-4ec3-9793-03d79e3d3d52.mp3";

//export const sunsetImg = "a1861ef2-5584-4d5d-b79b-b7d1ae5082c8.png";
//export const basketImg = "312cdd6d-e995-469a-ba3f-f3b8cbfeccd5.png";
export const penImg = "d93c9643-b6b5-4883-a530-f59f23cd0b2c.png";
export const penNewAudio = "a4df3da9-0425-40f6-a43d-90ed9e40cda3.mp3";

export const bagR1OneImg = "af54b135-8f1e-4e9b-9f64-14d35a7f0027.png";
//export const bagR1TwoImg = "d9bd8675-8e49-43d0-b2c3-cd005e58723c.png";
//export const bagR1ThreeImg = "14d4d46b-b269-436c-bf92-1b0655b14dbb.png";
export const bagR1OneAudio = "4214e2f7-27c9-4803-80d4-bc27e205170b.mp3";

//export const capR1TwoImg = "e514e897-2dc3-4fce-87e1-0a738349e174.png";
export const capR1OneImg = "45ee8428-8be6-4f6c-9f2f-e3a3e8d66ebc.png";
//export const capR1ThreeImg = "c30c305b-1451-45e5-9fb5-1b3e0ffbbec2.png";
//export const capR1OneAudio = "f8f050c7-76c5-4e98-919e-b86257259584.mp3";

export const dogR1OneImg = "c5f5e3c0-e5cf-42f6-801a-a93eb1f1a185.png";
//export const dogR1TwoImg = "cea58cbd-73bc-4b94-a4c8-5904ec10612a.png";
//export const dogR1ThreeImg = "6173c4f1-51d2-4e6d-8a7a-35b3d80aaeba.png";
//export const dogR1OneAudio = "d911b611-3541-4586-b2f0-a6793af5d1fe.mp3";

//export const eggR1TwoImg = "cf55fb7a-21f4-4e45-ad34-99f7fb77f2cc.png";
export const eggR1OneImg = "7b05d394-76e8-4583-8abd-c520da39ca2a.png";
//export const eggR1ThreeImg = "796fb5e5-006f-4a8e-ab3b-697b471d8c1b.png";
//export const eggR1OneAudio = "234b41b6-c366-409f-b08d-ed05ca3c26df.mp3";

//export const fanR1OneImg = "b9eb8dfc-0b28-4e49-8f83-cdc1135a1447.png";
//export const fanR1TwoImg = "c087addb-b437-4a4a-8722-ef3acd311df2.png";
//export const fanR1ThreeImg = "9e79a2d8-5133-4959-94a0-3b200ba1b92a.png";
//export const fanR1OneAudio = "64347710-8fa6-420a-95a6-c1e4f47eead9.mp3";

//export const hatR1TwoImg = "8932732b-15a7-4ced-adfe-c12da37cccb9.png";
//export const hatR1ThreeImg = "e8a8b105-2e74-40c3-a522-2154fc8683d5.png";
export const hatR1OneAudio = "a9ca3145-3a81-4a83-ba73-9b60e71cdb5d.mp3";

//export const TigerNewImg = "c6513466-596d-4a47-abff-0c8202c0dc5d.png";
export const TigerAudio = "5f5c440d-f421-4ae5-bc28-d4fb98ad7578.mp3";

//export const glassRImg = "b658a334-9405-489c-aa92-8a3879b9e452.png";
export const batRImg = "92bc2f24-9977-45ea-99d4-a6af60dc7aab.png";
//export const batRAudio = "3fb1f250-4000-47b7-9a27-ef1c2ca3e483.mp3";

//export const puzzleRImg = "bc5f2ff9-23e0-4c78-9faf-187475f3e0f2.png";
//export const aimRImg = "b1eb5874-5de3-4c02-ae37-433c96efa059.png";
//export const puzzleRAudio = "a9da53f8-9ac1-4d20-9dd0-53c923dad44d.mp3";

//export const lemonRImg = "8dc4f4fb-d8c4-42b1-b67d-7b77279ab1c3.png";
//export const lemonRAudio = "2a428354-d584-4999-b8e1-fcf0aeca6140.mp3";

//export const drumRImg = "ed6cff75-9f68-4650-b8d8-6cc0ec71f48a.png";
//export const drumRAudio = "c4f68661-76a6-4e79-ae62-7df8c309ee2a.mp3";

export const basketRImg = "312cdd6d-e995-469a-ba3f-f3b8cbfeccd5.png";
export const basketRAudio = "75ace319-2bdf-4ef2-8bfe-8f99dbc540aa.mp3";

//export const DinnerNewImg = "d8ae7f85-9262-434b-a813-5dd07780f7f0.png";
//export const shoutRImg = "eb944944-ade7-464c-9566-a0fa4585c731.png";
export const DinnerAudio = "a01366a7-e0a6-4a00-9e44-afcabfe46190.mp3";

export const sunShinesImg = "c1c4cf77-b951-4c2f-a2aa-ecd8725e7702.png";
export const wePlayImg = "bf38ed9b-01e5-43fb-b981-daa83f1fd63c.png";
export const heDancesImg = "0db9a578-3b48-4d6e-908f-3fd95d09c894.png";
export const sunShinesAudio = "bacfa1df-a291-484a-8bfd-2ce3dd5e4d8d.mp3";
export const fishSwimImg = "024d99b9-19dc-4bb7-82db-ccc5f23933f8.png";
//export const dogsBarkImg = "0012d4ce-4413-496e-814f-db47e408f1b5.png";
export const itRainsImg = "71d1f707-44ad-49d6-a8b5-e37096db3ec7.png";
export const fishSwimAudio = "d73b01b7-98d3-44f4-832b-31552e621dbb.mp3";
export const birdsFlyImg = "e6221717-d50b-4ca0-a0ad-d0ca93c73bfc.png";
export const sheReadsImg = "53a1261c-45c8-479c-ad78-2e5c5010526b.png";
export const weWinImg = "40c70927-e024-46c6-a4fc-856628d5d52d.png";
export const birdsFlyAudio = "f251e1e7-90c6-4f63-ac94-c7734df1a242.mp3";
export const sheSmilesImg = "7bb340e4-9549-4261-9724-c4dab309b899.png";
export const babyCriesImg = "2639fe7e-1422-4fcb-9382-d0138711b9a1.png";
export const heEatsImg = "05d02b15-f45b-4175-bdbd-323af82c33be.png";
export const sheSmilesAudio = "2106ad72-664c-43cb-9e2e-84622f68d11b.mp3";
export const youCookImg = "7547c0bf-6e0d-4151-99d5-db08c2f0aade.png";
export const theyLaughImg = "954c05e5-4cd8-452b-ae75-40e87f5fd908.png";
export const theyLaughAudio = "7f16821e-687f-4366-9509-4837202ac1bd.mp3";
export const wePlayAudio = "82877552-3a10-44d7-9683-90f64d63ee12.mp3";
export const clocksTickImg = "4c9fe4a6-8e62-441b-b9d8-3724c684d365.png";
export const sheSingsImg = "f9465763-4ce0-498a-b311-6891b0f404a6.png";
export const heDancesAudio = "8da026a1-c4b0-4c70-9bac-b8c11ac5c809.mp3";
export const flowersBloomImg = "1e3a27bd-f79e-4783-bcb0-3561652c6402.png";
export const sheSingsAudio = "7f06ea20-7c39-4621-8894-2dc9cf6ff417.mp3";
export const dogsBarkAudio = "344a89b5-b688-4ebb-9920-a6f91275c5cb.mp3";
export const iSleepImg = "94cff671-ae28-4a44-9819-0f104c73ec3b.png";
export const itRainsAudio = "34fddc0f-630d-40ca-82ed-7a7ae70d0d85.mp3";
export const youSwimImg = "eb0c4db7-ee6d-49bd-add2-c5292bbbbb7d.png";
export const youSwimAudio = "5f75ae16-870f-4de2-959c-5ee85ccb84bf.mp3";
export const iSleepAudio = "78dcd577-e299-47f0-b60d-278869d44bf1.mp3";
export const heEatsAudio = "5e0d0c63-5915-494d-a0cf-c303dee5194c.mp3";
export const sheReadsAudio = "80033243-d086-4835-b634-9524bd69c5f9.mp3";
export const clocksTickAudio = "3fff4b64-5f48-406d-99fc-88e1aafb6c02.mp3";
export const fireBurnsImg = "2471f4ed-9509-4e7f-bad0-f2b3efdb1186.png";
export const flowersBloomAudio = "a194c1fa-f6cb-4c97-a28d-8569d3e80790.mp3";
export const fireBurnsAudio = "1a804c02-c3c5-4251-a68f-2845f86aeb02.mp3";
export const babyCriesAudio = "654634db-5e03-4d3f-8216-f88edcf014fd.mp3";
export const youCookAudio = "5e9bdb5a-3df7-4789-8608-89e3b3b144e5.mp3";
export const weWinAudio = "14495c91-e4fd-493c-b219-cd27ab992df9.mp3";

export const Father = "6c26a434-6cae-4b59-844c-5ed360177267.png";
export const fatherNewAudio = "b54e3b55-f217-44b8-88ea-74f04139a651.mp3";

export const mangoR1OneImg = "186c263c-b157-44a0-99e4-636f83dc5ebd.png";
export const mangoNewAudio = "b0759f9c-7b52-4c67-ada8-2952933b8b78.mp3";

export const Mother = "0ffcd7ce-47c9-4d8a-b14b-ba4cc7a23be3.png";
export const motherNewAudio = "a2672cff-2529-4049-9f87-cf8b45e381b5.mp3";

//export const pencilImg = "dfa309a9-713b-4726-b822-d0423c033175.png";
export const pencilNewAudio = "d665d6b3-e427-44f6-897f-9080c51d11f4.mp3";

export const waterImg = "062a7af5-7dc7-4b3a-8977-e26fbbc8fc31.png";
export const waterNewAudio = "bf1a9a89-0607-4c72-91f0-5e0cf699cec0.mp3";

//export const basketImg = "312cdd6d-e995-469a-ba3f-f3b8cbfeccd5.png";
export const basketNewAudio = "04b93f9b-8ff4-4b9a-89d3-85c623bf4695.mp3";

export const cricketImg = "5a51abc0-cd61-4a07-b5e7-f3fa1c87182b.png";
export const cricketNewAudio = "0a75e2ec-7f59-45df-9223-1dcfc059cd7f.mp3";

export const doctorImg = "e03c3dbf-a6a2-4b0c-a5ca-6583c2b22af0.png";
export const doctorNewAudio = "63391d95-d84b-4d70-a067-bc5eccb35dfe.mp3";

export const marketImg = "b0d3e32f-ff4f-470a-b744-567eff9d1f99.png";
export const marketNewAudio = "9c2c72cd-96fd-4899-806c-1cf40f159434.mp3";

export const windowImg = "2fc1a46c-7a7b-44de-8f2d-da5a69b6793d.png";
export const windowNewAudio = "4e50ad4f-9df7-4b65-8c5e-3b9b13c6345d.mp3";

export const balloonImg = "dc7c02df-4cb4-46c7-83e0-53cfc962ab24.png";
export const balloonNewAudio = "0ff989d4-cfc0-4592-97dc-d4af19bf1cec.mp3";

//export const bicycleRImg = "0548cabb-fda1-49fe-884d-a5c480c8240c.png";
export const cycleNewAudio = "d9e60dd3-12a2-49f7-9bf2-2cc231d053be.mp3";

export const candleImg = "deb25a51-ce94-4835-802e-5172f5906d42.png";
export const candleNewAudio = "9d512ab4-da20-41a8-b899-5676fdc63e95.mp3";

//export const gardenImg = "07c44745-e9e3-4264-9645-3da09b4d66c8.png";
export const gardenNewAudio = "fb6b6ee4-0f5b-44af-afe9-c93091b71798.mp3";

export const scooterImg = "2f68c007-3277-4ca0-ac65-905c40af4fbd.png";
export const scooterNewAudio = "d08203de-438c-4bfa-9411-6a840cd6c1ce.mp3";

//export const flowerRImg = "ecb2ac92-c9ab-453e-bf89-015e9407e342.png";
export const flowerNewAudio = "7f76eea0-e602-4751-9015-924121ba0fcf.mp3";

export const papeerImg = "b0dee69a-b90e-4098-bbca-1722a05f05c0.png";
export const paperNewAudio = "2163f839-c007-4c01-ac4c-9539c3fbb5f6.mp3";

export const puppyImg = "6b6eddcc-c407-44a9-b08c-247f81d352a6.png";
export const puppyNewAudio = "86be014e-bb23-403d-b6e3-9f73ebf8aac9.mp3";

export const studentsImg = "3b34219b-1ed7-435a-b6ab-b0c3cb0b7962.png";
export const studentNewAudio = "c9d20f52-6d62-426b-a784-c6493ede67cd.mp3";

export const musicImg = "ef9d0cf3-8041-42e7-bdf4-b2b45b5418f3.png";
export const musicNewAudio = "2610cc0a-4af9-45e4-bec5-e86b6b7df06b.mp3";

export const superMarketAudio = "680e320f-e18e-4083-abb4-4b93ec121206.mp3";

export const level13P1Audio1 = "fe89cb1d-3666-46b3-b744-b88beb95b12a.mp3";
export const level13P1Audio2 = "036e0c61-a587-46ab-93bf-132b31461223.mp3";
export const level13P1Audio3 = "f1d828b0-1bac-478b-a2a3-9a562c1817df.mp3";
export const level13P1Audio4 = "7d313b73-60a0-4588-87c2-56daa5068e53.mp3";
export const level13P1Audio5 = "fce0208b-887b-4fdc-b9da-038e9cead93e.mp3";
export const level13P1Audio6 = "3c2a9811-6c79-4496-bd09-52f69a91ff49.mp3";
export const level13P1Audio7 = "e61dd80c-5075-4066-ad5f-b1ccdbfbacd6.mp3";
export const level13P1Audio8 = "e7818b77-20bc-4d29-b93b-7e32dc7ae0a4.mp3";
export const level13P1Audio9 = "e5e93de9-646f-4865-92c1-a1b940626237.mp3";
export const level13P1Audio10 = "a04751ef-e38a-4ef5-abe6-4cc9a8bedd05.mp3";
export const meetingImg = "a88a0dda-cb3f-4de1-8a4a-10bdf2a4bc7e.png";
export const vacationImg = "1ca36a75-09f1-4c1e-87d7-1468a8603fd7.png";
export const partyImg = "b8d3b765-2a6d-4ae0-bcde-8ca8465ca9da.png";
export const bengaluruImg = "0ec69ace-ce8a-42c3-865b-76f9d80824da.png";
export const hospitalImg = "d8cd7610-7c19-4fcb-9ea2-0f549b860e73.png";
export const restaurantImg = "7b7d1cde-51e6-4088-b8f1-c3059764f838.png";
export const twoImg = "ba1c9b62-ed09-415f-a642-a85969d82bea.png";
export const tenImg = "0a05ebd6-fdc2-4248-9a75-6b98c1ce3093.png";
export const fiveImg = "ae5a3725-48cc-4fba-ae26-b5cc1902ad2a.png";
export const aloneImg = "d28c1ea6-bef7-4dd8-8310-87069292429e.png";
export const groupImg = "ab29cde8-197b-4466-b1af-746d695cc95c.png";
export const familyImg = "817ed644-e9b2-436a-9b7e-932e215739bd.png";
export const petImg = "0ff82049-384d-4c24-9bf7-bb8a63af37c4.png";
export const friendImg = "8a5354d0-0944-4788-9de2-1851af77ae0b.png";
export const teacherImg = "206b38d7-4127-4818-a47e-153ed3b35f55.png";
export const fairOneImg = "243c1811-01c1-43b3-a21a-6acb469fedb7.png";
export const fairFourImg = "2eaecfe5-a781-492a-9ab8-af01840b9e75.png";
export const fairThreeImg = "f00462ba-6e78-4019-bb95-adf4a6212e8b.png";
export const fairFiveImg = "c517e938-6536-488f-8902-1256a6eccb41.png";
export const fairTwoImg = "2854e3a8-db40-4d99-910b-c4f057a912e0.png";
export const fairOneAudio = "db51b8c2-3a08-45ff-9362-175d0a5c40b1.mp3";
export const fairTwoAudio = "cea8a2d9-b796-46af-9e26-7860d6473cb0.mp3";
export const fairThreeAudio = "349edbe4-ebb7-4f10-978c-888993509dd6.mp3";
export const fairFourAudio = "8327296a-679a-403c-bb9e-392ccbd27aed.mp3";
export const healthyHabitsImg = "9ec160c8-766c-4646-958f-94a667ac1964.png";
export const level13S1Audio1 = "88ebb948-9768-4f81-8071-72b9c44f409d.mp3";
export const level13S1Audio2 = "16ef2ab6-a8e5-459f-b3d7-5b6e6138a67c.mp3";
export const level13S1Audio3 = "51b34b74-bfc2-4793-9f0a-6cfd1b5bfd42.mp3";
export const level13S1Audio4 = "e95d58ea-af9c-4dfb-bd3a-c56221fa3503.mp3";
export const level13S1Audio5 = "dd109275-d1b5-4c22-9b82-30ab42c87c3d.mp3";
export const level13S1Audio6 = "6bd9c792-a759-4ad3-91c1-374d3a4d727a.mp3";
export const level13S1Audio7 = "3609eef2-c604-44ce-af96-58130532ec5e.mp3";
export const level13S1Audio8 = "4b36edd9-0b82-4b51-8edd-65d59577a4a1.mp3";
export const level13P5Audio1 = "0b9d6111-841e-4e74-8dfe-64fa5182de65.mp3";
export const level13P5Audio2 = "7563da68-b979-42e7-b223-d3303efef7b5.mp3";
export const level13P5Audio3 = "c313fe39-ad4d-45c3-9f51-6d13fc98fa06.mp3";
export const level13P5Audio4 = "ead44224-42d4-4034-9868-9e758458dfb9.mp3";
export const level13P5Audio5 = "9b8d578e-14fd-4d60-a5cf-76bc427dbd16.mp3";
export const level13P5Audio6 = "8fc5cd09-6062-41f3-ad06-9284fd9f7354.mp3";
export const level13P5Audio7 = "fe0ef2e6-2a85-4ea6-8524-6617a4c80b0c.mp3";
export const level13P5Audio8 = "4e42a87d-cb1d-4f99-a2ec-2ea91e7dede3.mp3";
export const level13P5Audio9 = "f3cde4df-352e-4951-81f0-52ac6b463512.mp3";
export const level13P5Audio10 = "984df7da-01e4-49a2-ab18-04150ea442df.mp3";
export const level13P5Audio11 = "c96d7fdb-c498-4b1e-b392-7453d6cde4b0.mp3";
export const level13P5Audio12 = "5abba1a5-ec73-49af-9e0f-729b3c591b93.mp3";
export const shoesImg = "29212161-1c14-41ae-bd6e-87b5969c1252.png";
export const hatImg = "b1c1787f-be4c-48a7-b01c-2d3d5970f9cf.png";
export const glovesImg = "237ec9af-9c1c-4a0c-aac9-1c4d14c9654b.png";
export const parkImg = "44555c03-7861-4174-bc17-6ee6baf54ddd.png";
export const mallImg = "2f30b3ab-220c-427b-95c7-edf3452bbbc9.png";
export const officeImg = "97eb6889-c5bd-4034-9a4f-6539c9b8a2f9.png";
export const thirtyImg = "69a4e043-d0e1-44e6-b2af-6be26f8803f7.png";
//export const fiveImg = "ae5a3725-48cc-4fba-ae26-b5cc1902ad2a.png";
export const sixtyImg = "6eac8731-adee-48c2-a7b1-0c2a956f8e9a.png";
//export const waterImg = "589f1bd2-4272-4f5f-87db-0923aac6765f.png";
export const juiceImg = "899f394c-3d8a-48fe-b941-224e39f58aea.png";
export const milkImg = "dd005ee7-15da-4563-9544-507587f5264d.png";
export const smoothieImg = "f61243ae-3ddc-483a-adfc-cfbe0c01c8ab.png";
export const burgerImg = "6962e00e-ce2e-42b1-ba9c-4dfef45c9f86.png";
export const pizzaImg = "2370e2ca-4aab-4880-9c55-281cd4d41f22.png";
export const puppyOneImg = "9323413b-c982-445f-832a-6d180ef5d803.png";
export const puppyFourImg = "fab193ef-57a4-4443-a8d9-656195a7c1a7.png";

export const puppyThreeImg = "cf78aa57-8d61-4546-a656-820c5787e767.png";
export const puppyFiveImg = "5e655ccb-b938-4428-9a58-def0c2f87407.png";
export const puppyTwoImg = "347b585c-d047-4194-817d-0b9e445e0367.png";

export const puppyOneAudio = "26076cca-2de7-4316-ac6f-30528efe0257.mp3";
export const puppyTwoAudio = "4155aeef-2f8d-41ee-b676-2e016d26c517.mp3";
export const puppyThreeAudio = "351c8150-edb1-4e41-8928-71e88066b5de.mp3";
export const puppyFourAudio = "7792d1c8-f1db-456d-950d-df7334c86875.mp3";

export const roadSafetyImg1 = "5dbd3768-4e06-41f3-91af-0d641e84bbda.png";
export const roadSafetyImg2 = "f9aeac87-7a33-45b2-b0e0-cf1ef5e229e6.png";
export const roadsafetyAnouncementImg =
  "c8ea41ca-4462-4d91-abc9-de32a6a7a17e.png";

export const roadSafetyAudio = "b2c4dd09-26f2-4613-b066-ee7e25d01bca.mp3";
export const level13P1CAudio = "c14c2c5c-72cf-49e9-a305-3b85d8de813d.mp3";
export const level13P5CAudio = "e672dc1f-02db-4af3-8d81-99e1e1ebca5d.mp3";
export const level13S1CAudio = "f5564f8b-c616-48cf-90d7-e715e41783d9.mp3";
export const level13S2CAudio = "420e5f17-7732-4ddd-928b-e8b2f025aa92.mp3";

export const level13S2Audio1 = "215b4ee8-0b6f-449f-a255-bb64f0fa0009.mp3";
export const level13S2Audio2 = "aacc273e-f37c-44c8-b2c6-4dc0717c4fde.mp3";
export const level13S2Audio3 = "a7c03a9a-13d3-4228-8527-00a3dfea8869.mp3";
export const level13S2Audio4 = "0029b9ea-28eb-48e6-82be-877219e18b22.mp3";
export const level13S2Audio5 = "d711339c-6046-4ead-8942-3db286c374ce.mp3";
export const level13S2Audio6 = "d47feb58-cb82-425d-87ac-65ed4bf92511.mp3";
export const level13S2Audio7 = "3125011b-f314-4cf6-9548-ff94579a0767.mp3";
export const level13S2Audio8 = "40f358a4-fc26-408a-8691-003d6818d489.mp3";
export const level13S2Audio9 = "7f96f637-b06e-4934-b294-86b25d361862.mp3";

export const level15P1OneUAudio = "21c03e04-7172-4800-9c41-1e44713c9106.mp3";
export const level15P1TwoUAudio = "afdf7ab8-02d6-4c47-86a2-70f2a472b3f3.mp3";
export const level15P1ThreeUAudio = "f3eadd72-4843-4121-8667-42704bcb2660.mp3";
export const level15P1FourUAudio = "d2ca7e2a-aa3e-4276-87f8-0d2b42417130.mp3";
export const level15P1FiveUAudio = "6a4efd78-3fa6-42a1-bf80-07ccede10ace.mp3";
export const level15P1SixUAudio = "7b677b68-95c6-49c9-a7bf-aa075c693879.mp3";

export const level15P2OneAudio = "2a5cab63-a001-4ba4-bbec-bac20dacd1f8.mp3";
export const level15P2TwoAudio = "c5e69711-16e7-473e-be86-5433c3513da3.mp3";
export const level15P2ThreeAudio = "db8ec164-2287-4279-a869-e2c992d8bf89.mp3";
export const level15P2FourAudio = "fb721ad8-0a59-4dee-9e4d-8b286b66841c.mp3";
export const level15P2FiveAudio = "c46b009d-dfcc-4940-b29b-ff6c9fb5cde3.mp3";

export const ToyAudio = "63b5107a-9d0a-4454-b4ad-24c07c9f4750.mp3";
export const PillowAudio = "93e7e25d-12ee-473b-8e9a-39724504633c.mp3";
export const BasketAudio = "75ace319-2bdf-4ef2-8bfe-8f99dbc540aa.mp3";

export const BookAudio = "bddedb76-c5fd-4fb7-910b-8a760bfc132b.mp3";
export const KeyboardAudio = "bfc9b38c-abbc-4ce0-8982-8e994a00faee.mp3";
export const TeddyBearAudio = "eeecf97d-8373-40fa-b9ee-59659a1f5458.mp3";

export const TabletAudio = "cdfd35af-aeae-4799-bf32-5c5f6fdada75.mp3";
export const ClockAudio = "fa2765ad-47cb-4d48-9537-1fe8b62b3e1d.mp3";
export const BottleAudio = "af6bc5b2-6fb0-445b-a961-f30348560e6e.mp3";

export const TelevisionAudio = "114dc5e7-00cb-4959-8900-2fb5c26f2d91.mp3";
export const ChairAudio = "2407000e-b5d3-4aef-ab2b-9e17e7fc99d7.mp3";
export const TableAudio = "29c089b4-94c3-41d8-91df-e72fe99a920b.mp3";

export const GuitarAudio = "706ffbce-efc7-4221-a78a-1b4485ddc20c.mp3";
export const PianoAudio = "b54dd467-d711-4b87-b37e-c1cfc617875e.mp3";
export const ViolinAudio = "bb55860d-f416-4c55-a2de-283650ac7e44.mp3";

export const SnakeAudio = "a62ea2e7-3424-44bb-98fa-ca4235041609.mp3";
export const CrocodileAudio = "711bbedc-c331-4b15-bfe3-fd423526d590.mp3";
export const LizardAudio = "49141134-5618-470f-ba86-fef7ca818af4.mp3";

export const ElephantAudio = "36e64a0a-1757-4e6a-b2ad-ab465efd914c.mp3";
export const RhinoAudio = "deb70a42-0c9b-4274-aba9-aa2de9319085.mp3";
export const HippoAudio = "9097ef2e-3db0-488e-95e9-370ebb25157f.mp3";

export const ElevatorAudio = "07bef3aa-2f48-4d6e-a7be-4441b98aea3a.mp3";
export const SeesawAudio = "f48e5b2a-f8de-40e2-8240-ede354c04bbe.mp3";
export const StaircaseAudio = "8056a2a1-543f-4ffc-9ad9-530731d9a045.mp3";

export const CloudAudio = "420031e4-c82f-4867-a1df-06f2519f4155.mp3";
export const BirdAudio = "7b5a1a9c-7c92-46a1-aecd-3b5069df9191.mp3";
export const WindAudio = "d5528aea-75dc-44fb-bd48-4b6762456f02.mp3";

export const MicroscopeAudio = "0015a84a-a290-4c87-b4bc-14bd77295406.mp3";
export const TelescopeAudio = "a98d75c8-9b2d-45c8-a419-741690ce7928.mp3";
export const BinocularsAudio = "855cb7b1-4c68-4b93-964e-2908cfbb5cd2.mp3";

export const level15S1OneUAudio = "9c436adb-2dd9-4d7e-9fa1-a37e02ec8a32.mp3";
export const level15S1TwoUAudio = "2d022fcd-758c-4cb8-8a9a-4ae6c9d85497.mp3";
export const level15S1ThreeUAudio = "97140538-e6aa-4e59-a9c6-c5312f71db52.mp3";
export const level15S1FourUAudio = "2a96f540-255a-4d96-8c20-e60ad48684ea.mp3";
export const level15S1FiveUAudio = "5ddd80ec-3e99-432b-842b-d504a0d61af1.mp3";

export const MeowsAudio = "37b2bf4e-9c7e-47fa-b8e3-fc63f77482e9.mp3";
export const BarksAudio = "ccecdbaf-389e-4643-af53-6258fae7c6fb.mp3";
export const HissesAudio = "57742111-7c66-4560-933e-f22203a37352.mp3";

export const GrowlsAudio = "01148517-c439-4557-8b48-571d830eeae0.mp3";
export const RoarsAudio = "d1df5b6c-bcdd-42d8-9b34-e969e9c7fef5.mp3";
export const SnarlsAudio = "d04fa173-64e1-4296-9a97-c8ca29ed7b01.mp3";

export const HorseAudio = "e708b1cd-13d9-4d7e-8be1-a27dfd53bbd3.mp3";
export const CowAudio = "2f1c4637-3e1b-4aa2-99ce-0f6339390742.mp3";
//const ElephantAudio = "6fb1684e-20d3-4aa2-b3c2-daec489367bc.mp3";

//export const BirdAudio = "d80a5bff-6525-43e0-b46d-3e6da26c4adf.mp3";
export const DogAudio = "ccecdbaf-389e-4643-af53-6258fae7c6fb.mp3";
export const CatAudio = "37b2bf4e-9c7e-47fa-b8e3-fc63f77482e9.mp3";

//const HorseAudio = "e708b1cd-13d9-4d7e-8be1-a27dfd53bbd3.mp3";
export const GoatAudio = "27724b3a-c1b2-4588-b429-cc82705a673e.mp3";
export const LionAudio = "6c228f8d-0a7b-463f-9f98-c3a25c41ebba.mp3";

export const childImage = "31665b4f-973c-4fee-b86f-5e86ab4c6f33.png";
export const mallImage = "81b4dffc-3a3b-4048-9d0c-d3b07f927afd.png";
export const supermarketAnouncementImg =
  "680e320f-e18e-4083-abb4-4b93ec121206.mp3";
