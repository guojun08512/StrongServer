
import jwt from 'jsonwebtoken';
import config from 'modules/config';
import { expect, request } from '../../utils';

module.exports = {
  description: 'authenticate',
  func: () => {
    it('should generate token', async () => {
      const token = jwt.sign({ key: 'wzDyN0BDsEl2JmgW', secrect: 'CUjn2POzoVD0cqhnYDfYqutEcYupLJ' }, config.get('PUBLIC_KEY'), { expiresIn: '7d' });
      const credential = jwt.verify(token, config.get('PUBLIC_KEY'));
      expect(credential.key).to.equal('wzDyN0BDsEl2JmgW');
      expect(credential.secrect).to.equal('CUjn2POzoVD0cqhnYDfYqutEcYupLJ');
    });

    it('should get token', async () => {
      const res = await request
        .post('/v1/users/login')
        .send({
          username: 'readonly',
          password: 'readonly',
        })
        .expect(200);
      console.log(res.body.data.token);
      expect(res.body.data).to.have.property('token');
    });
  },
};

