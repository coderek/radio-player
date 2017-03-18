import { RadioPlayerPage } from './app.po';

describe('radio-player App', function() {
  let page: RadioPlayerPage;

  beforeEach(() => {
    page = new RadioPlayerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
