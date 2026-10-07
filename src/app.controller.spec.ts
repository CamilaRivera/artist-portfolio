import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  const controller = new AppController({} as AppService);

  it('provides homepage metadata and portfolio images', () => {
    const page = controller.root();
    expect(page.headSlug.title).toBe('index.head.title');
    expect(page.imagesBar).toHaveLength(16);
  });
});
