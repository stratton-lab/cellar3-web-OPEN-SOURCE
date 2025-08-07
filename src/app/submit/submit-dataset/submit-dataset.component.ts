import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../backend.service";
import {Message} from "../../message";
import {ActivatedRoute} from "@angular/router";
import {SubmissionInfo} from "./submission-info.interface";
import {HttpEventType} from "@angular/common/http";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'submit-dataset',
  templateUrl: './submit-dataset.component.html',
  styleUrls: ['./submit-dataset.component.scss']
})
export class SubmitDatasetComponent implements OnInit {

  uploadProgress: number = 0
  busy: boolean = false
  msg: Message | null = null
  submission: SubmissionInfo | null = null

  rdsFile: File | null = null
  previewImage: File | null = null
  spatialImages: File[] = []


  constructor(private route: ActivatedRoute, private backend: BackendService, private logger: NGXLogger) {
    this.reset()
  }

  ngOnInit(): void {
    const submissionId = this.route.snapshot.paramMap.get('submission_id')
    if (submissionId) {
      this._load(submissionId)
    } else {
      this.msg = {title: 'Incorrect parameters', detail: 'Please provide submissionID in the URL'}
    }
  }

  reset() {
    this.rdsFile = null
    this.previewImage = null
    this.spatialImages = []
    this.submission = null
  }

  _load(submission_id: string): void {
    this.busy = true
    this.backend.getSubmissionInfo(submission_id).subscribe({
      next: (submission: SubmissionInfo) => {
        this.busy = false
        this.submission = submission
      },
      error: err => {
        this.busy = false
        this.msg = {
          title: "Can not access submission.",
          detail: err?.error?.detail || err.statusText,
          type: 'error'
        }
      }
    })
  }

  onSingleFileSelected(key: 'rdsFile' | 'previewImage', file: File) {
    this[key] = file
  }

  onSpatialFileSelected(index: number, file: File) {
    this.spatialImages[index] = file
  }

  isReadyForSubmission = () => !!this.rdsFile && !!this.submission

  createFormData(): FormData {
    const formData = new FormData()
    if (this.rdsFile) formData.append('file', this.rdsFile)
    if (this.previewImage) formData.append('previewImage', this.previewImage)
    this.spatialImages.forEach(file => {
      // They will be in the same order as the embeddings in embeddings list in submission.
      if (file) formData.append('spatialImages', file)
    })
    return formData
  }

  submit() {
    if (this.isReadyForSubmission() && this.submission) {
      window.scrollTo({top: 0, behavior: 'smooth'})
      this.busy = true
      this.uploadProgress = 0
      const form = this.createFormData()
      this.backend.submitDatasetFile(this.submission.id, form).subscribe({
        next: event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round((100 * event.loaded) / (event.total || 1))
          } else if (event.type === HttpEventType.Response) {
            this.busy = false
            this.reset()
            this.msg = {
              title: 'Your dataset was successfully submitted',
              detail: event?.body?.details,
              type: 'success'
            }
          }
        },
        error: err => {
          this.busy = false
          this.msg = {
            title: "Can not submit dataset",
            detail: err?.error?.detail || err.statusText,
            type: 'error'
          }
        }
      })
    } else {
      this.logger.warn('Please open an RDS file first, before submitting.')
    }
  }
}
