import { AppController } from './app.controller';
import { AppService } from './app.service';
import { imageFilenames } from './db.images';
import type { Response } from 'express';

describe('AppController', () => {
  const controller = new AppController({} as AppService);

  it('provides homepage metadata and portfolio images', () => {
    const page = controller.root();
    expect(page.headSlug.title).toBe('index.head.title');
    expect(page.heroImage.name).toBe('Bowie.jpg');
    expect(page.featuredImages).toHaveLength(6);
    const gallery = [...page.featuredImages, ...page.moreImages];
    expect(new Set(gallery.map((image) => image.name)).size).toBe(
      imageFilenames.length,
    );
    expect(controller.root().featuredImages).toEqual(page.featuredImages);
  });

  it('waits for email delivery before returning success', async () => {
    let finishDelivery!: () => void;
    const delivery = new Promise<void>((resolve) => {
      finishDelivery = resolve;
    });
    const sendContactEmail = jest.fn().mockReturnValue(delivery);
    const contactController = new AppController({
      sendContactEmail,
    } as unknown as AppService);
    let completed = false;
    const result = contactController
      .contactProcess(
        {
          name: 'Customer',
          email: 'customer@example.com',
          type: 'Help me choose',
          body: '',
        },
        {} as Response,
      )
      .then((page) => {
        completed = true;
        return page;
      });
    await Promise.resolve();
    expect(completed).toBe(false);
    finishDelivery();
    expect(await result).toMatchObject({ success: true });
  });
});
