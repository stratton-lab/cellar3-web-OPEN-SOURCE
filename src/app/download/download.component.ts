import {Component, Input} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {Message} from "../message";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent {

  @Input()
  formats: string[]

  @Input()
  name: string

  @Input()
  backend: Function

  busy = false
  msg: Message | null = null

  icons: { [key: string]: string } = {
    csv: 'fa-file-csv',
    excel: 'fa-file-excel',
    json: 'fa-file-code',
    image: 'fa-file-image',
    pdf: 'fa-file-pdf'
  }

  constructor(private logger: NGXLogger, private toast: ToastrService) {
  }

  onFormatSelected(format: string) {
    format = format.toLowerCase()
    this.busy = true
    this.msg = null
    this.backend(format).subscribe({
      next: (data: Blob) => {
        this.busy = false
        this.downloadFile(data, this.name)
      },
      error: (err: any) => {
        this.busy = false
        this.msg = {title: 'Export Failed', detail: err?.detail}
        this.toast.error(this.msg.detail, this.msg.title)
        this.logger.error('Could not export differential expression', err)
      }
    })
  }

  private downloadFile(data: Blob, name: string) {
    this.logger.info('Export data received from server as blob.  Triggering file download in browser.')
    const blob = new Blob([data], {type: data.type})
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  getIcon(format: string) {
    format = format.toLowerCase()
    return this.icons[format] || 'fa-file'
  }
}
