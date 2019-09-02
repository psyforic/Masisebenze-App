import { MasisebenzeFCETemplatePage } from './app.po';

describe('MasisebenzeFCE App', function() {
  let page: MasisebenzeFCETemplatePage;

  beforeEach(() => {
    page = new MasisebenzeFCETemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
