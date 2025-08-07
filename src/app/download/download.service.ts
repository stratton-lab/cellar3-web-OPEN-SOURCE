import {Injectable} from '@angular/core';
import {NGXLogger} from "ngx-logger";

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private logger: NGXLogger) {
  }

  downloadJSON(object: any, name: string) {
    // this.logger.info('[DownloadService] (downloadFile) Preparing JSON for download:', object)
    const jsonString = JSON.stringify(object)
    const blob = new Blob([jsonString], {type: 'application/json'})
    this.downloadFile(blob, name)
  }

  downloadFile(data: Blob, name: string) {
    this.logger.info('[DownloadService] (downloadFile) Triggering file download in browser.')
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

}
