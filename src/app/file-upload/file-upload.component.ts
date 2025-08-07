import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnDestroy {

  @Input() title = 'Please select a file to upload.'

  @Input() description: string

  @Input() btnText = 'Select File'

  @Input() icon = 'bi bi-file-earmark-arrow-up-fill'

  @Input() busy = false

  @Output() onFileUpload = new EventEmitter<File>()

  file: File | null | undefined

  previewUrl: string | null = null

  constructor() {
  }

  ngOnInit(): void {
  }


  /**
   * Returns the selected file.
   * @param e
   */
  onFileSelected(e: Event) {
    const input: HTMLInputElement = (e.target as HTMLInputElement)
    this.file = input.files?.item(0)

    if (this.file) {
      this.generatePreview()
      input.value = "" // We need to reset the file value to be able to try again with the same file if server error
      this.onFileUpload.next(this.file)
    }
  }


  getSelectedFileName = () => this.file?.['name'] as string

  isFileSelected = () => !!this.file

  generatePreview() {
    if (this.file?.type.startsWith('image/')) {
      this.previewUrl = URL.createObjectURL(this.file)
    } else {
      this.previewUrl = null
    }
  }

  ngOnDestroy() {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl)
  }
}
