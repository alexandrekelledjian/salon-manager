const request = require('supertest');
const app = require('../src/app');

describe('API Salons', () => {
    let adminToken;

           // Test: GET public salon actif → 200
           describe('GET /api/public/salons/by-code/:code_url', () => {
                 it('should return 200 for active salon', async () => {
                         const res = await request(app)
                           .get('/api/public/salons/by-code/HAIR75001')
                           .expect(200);

                          expect(res.body).toHaveProperty('code_url', 'HAIR75001');
                         expect(res.body).toHaveProperty('actif', true);
                         expect(res.body).toHaveProperty('nom', 'Salon Coiffure Paris');
                 });

                        // Test: GET public salon inactif → 404
                        it('should return 404 for inactive salon', async () => {
                                const res = await request(app)
                                  .get('/api/public/salons/by-code/SPA13001')
                                  .expect(404);

                                 expect(res.body).toHaveProperty('error', 'Salon non trouvé');
                        });

                        it('should return 404 for non-existent salon', async () => {
                                const res = await request(app)
                                  .get('/api/public/salons/by-code/INVALID')
                                  .expect(404);

                                 expect(res.body).toHaveProperty('error', 'Salon non trouvé');
                        });
           });

           // Test: Routes admin sans token → 401
           describe('Admin routes without token', () => {
                 it('GET /api/admin/salons should return 401 without token', async () => {
                         const res = await request(app)
                           .get('/api/admin/salons')
                           .expect(401);

                          expect(res.body).toHaveProperty('error', 'Token manquant');
                 });

                        it('POST /api/admin/salons should return 401 without token', async () => {
                                const res = await request(app)
                                  .post('/api/admin/salons')
                                  .send({ code_url: 'TEST', nom: 'Test' })
                                  .expect(401);

                                 expect(res.body).toHaveProperty('error', 'Token manquant');
                        });

                        it('PATCH /api/admin/salons/:id should return 401 without token', async () => {
                                const res = await request(app)
                                  .patch('/api/admin/salons/some-id')
                                  .send({ nom: 'Test' })
                                  .expect(401);

                                 expect(res.body).toHaveProperty('error', 'Token manquant');
                        });
           });

           // Test: Login admin OK puis création salon OK
           describe('Admin login and create salon', () => {
                 it('should login admin and get token', async () => {
                         const res = await request(app)
                           .post('/api/admin/auth/login')
                           .send({ email: 'admin@example.com', password: 'Admin123!' })
                           .expect(200);

                          expect(res.body).toHaveProperty('token');
                         adminToken = res.body.token;
                 });

                        it('should reject login with wrong password', async () => {
                                const res = await request(app)
                                  .post('/api/admin/auth/login')
                                  .send({ email: 'admin@example.com', password: 'wrong' })
                                  .expect(401);

                                 expect(res.body).toHaveProperty('error', 'Identifiants invalides');
                        });

                        it('should create a new salon with valid token', async () => {
                                const res = await request(app)
                                  .post('/api/admin/salons')
                                  .set('Authorization', `Bearer ${adminToken}`)
                                  .send({
                                              code_url: 'NEW75002',
                                              nom: 'Nouveau Salon Test',
                                              email: 'test@newsalon.fr',
                                  })
                                  .expect(201);

                                 expect(res.body).toHaveProperty('code_url', 'NEW75002');
                                expect(res.body).toHaveProperty('nom', 'Nouveau Salon Test');
                                expect(res.body).toHaveProperty('id');
                        });

                        it('should return 409 for duplicate code_url', async () => {
                                const res = await request(app)
                                  .post('/api/admin/salons')
                                  .set('Authorization', `Bearer ${adminToken}`)
                                  .send({
                                              code_url: 'HAIR75001',
                                              nom: 'Duplicate Test',
                                  })
                                  .expect(409);

                                 expect(res.body).toHaveProperty('error', 'code_url déjà utilisé');
                        });

                        it('should list all salons', async () => {
                                const res = await request(app)
                                  .get('/api/admin/salons')
                                  .set('Authorization', `Bearer ${adminToken}`)
                                  .expect(200);

                                 expect(res.body).toHaveProperty('salons');
                                expect(Array.isArray(res.body.salons)).toBe(true);
                                expect(res.body.salons.length).toBeGreaterThanOrEqual(3);
                        });

                        it('should update salon and update updated_at', async () => {
                                const listRes = await request(app)
                                  .get('/api/admin/salons')
                                  .set('Authorization', `Bearer ${adminToken}`);

                                 const salon = listRes.body.salons[0];
                                const originalUpdatedAt = new Date(salon.updated_at);

                                 await new Promise((resolve) => setTimeout(resolve, 100));

                                 const res = await request(app)
                                  .patch(`/api/admin/salons/${salon.id}`)
                                  .set('Authorization', `Bearer ${adminToken}`)
                                  .send({ nom: 'Updated Name' })
                                  .expect(200);

                                 expect(res.body).toHaveProperty('nom', 'Updated Name');
                                expect(new Date(res.body.updated_at).getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
                        });

                        it('should toggle salon actif status', async () => {
                                const listRes = await request(app)
                                  .get('/api/admin/salons')
                                  .set('Authorization', `Bearer ${adminToken}`);

                                 const salon = listRes.body.salons.find((s) => s.code_url === 'NAIL69001');

                                 const res = await request(app)
                                  .patch(`/api/admin/salons/${salon.id}`)
                                  .set('Authorization', `Bearer ${adminToken}`)
                                  .send({ actif: false })
                                  .expect(200);

                                 expect(res.body).toHaveProperty('actif', false);
                        });
           });
});
