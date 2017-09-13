export default function(spec) {

  spec.describe('Tapping on google', function() {

    spec.it('Tapping on google Success', async function() {
      await spec.exists('Login.button');
      await spec.press('Login.button');
    });
  });
}
