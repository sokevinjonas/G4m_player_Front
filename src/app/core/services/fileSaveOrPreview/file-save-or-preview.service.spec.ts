import { TestBed } from '@angular/core/testing';

import { FileSaveOrPreviewService } from './file-save-or-preview.service';

describe('FileSaveOrPreviewService', () => {
  let service: FileSaveOrPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileSaveOrPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
