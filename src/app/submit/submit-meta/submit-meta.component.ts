import {Component} from '@angular/core';
import {Dataset} from "../../dataset";
import _ from "lodash";
import {FIELDS, SPECIES} from "./fields";
import {Field, FieldEmbed, FieldType, SubmitMetaResult, ValidationFunction} from './fields.interface';
import $ from 'jquery'
import {BackendService} from "../../backend.service";
import {validateRequired} from "./validators";
import {Message} from "../../message";
import {MetaForm} from "./meta.interface";

@Component({
  selector: 'submit-meta',
  templateUrl: './submit-meta.component.html',
  styleUrls: ['./submit-meta.component.scss']
})
export class SubmitMetaComponent {
  FieldType = FieldType

  fields: MetaForm
  fieldsList: FieldEmbed[]

  busy: boolean = false
  submitMsg: Message | null = null

  // Calculated fields. Updated when any field is updated in fields
  datasetId: string | null = null

  constructor(private backend: BackendService) {
    this.reset()
  }

  /**
   * Returns the first error found by any validators in the list. Returns undefined if no errors found.
   * @param field
   */
  getValidationErrorMessage(field: Field): string | void {
    const validators: ValidationFunction[] = [validateRequired, ...(field.validators || [])]
    for (const validator of validators) {
      const msg = validator(field)
      if (msg) return msg
    }
  }


  getSpeciesAcronym = (species: string) => SPECIES.find(obj => obj.name === species)?.shortcut || species

  /**
   * Ex: RNA_Ms_BrainSNc_PD_2023
   * Molecule_Species_Tissue_State_Year
   */
  generateDatasetId(meta: MetaForm): string {
    return [
      meta.molecule.value.toString(),
      this.getSpeciesAcronym(meta.species.value.toString()),
      meta.tissue.value.toString().replace(' ', ''),
      meta.state.value.toString().replace(' ', ''),
      meta.year.value
    ].join('_')
  }

  refreshDatasetId() {
    this.datasetId = this.generateDatasetId(this.fields)
  }

  /**
   * Validates each field using registered validators.
   */
  validate() {
    _.forEach(this.fields, (field: Field) => {
      field.invalidMsg = this.getValidationErrorMessage(field) || undefined
    })
  }

  as_dataset(): Dataset {
    const datasetId = this.generateDatasetId(this.fields)
    return {
      id: datasetId,
      name: this.fields.name.value as string,
      public: this.fields.public.value as boolean,
      description: this.fields.description.value as string,
      image: `${datasetId}.jpg`,
      file: `${datasetId}.h5ad`,
      species: this.fields.species.value as string,
      tissue: this.fields.tissue.value as string,
      cells: this.fields.cells.value as number,
      type: this.fields.type.value as string,
      categories: [this.fields.category.value as string],
      keywords: (this.fields.keywords.value as string).split(',').map(k => k.trim()).filter(k => k?.length),
      linksPublications: (this.fields.publication.value as string).split(',').filter(url => url?.length).map(url => {
        return {
          name: 'Publication',
          url: url
        }
      }),
      linksDatasets: (this.fields.dataset.value as string).split(',').filter(url => url?.length).map(url => {
        return {
          name: 'Dataset',
          url: url
        }
      }),
      info: _.pickBy({
        cellType: this.fields.cellTypeField.value,
        condition: this.fields.conditionField.value,
        sample: this.fields.sampleField.value
      }, value => value),
      groups: [
        {name: 'Condition', key: this.fields.conditionField.value as string},
        {name: 'Cell Type', key: this.fields.cellTypeField.value as string},
        {name: 'Sample', key: this.fields.sampleField.value as string}
      ].filter(group => group.key.length > 0),
      maintainer: {
        name: this.fields.maintainerName.value as string,
        email: this.fields.maintainerEmail.value as string,
        affiliation: this.fields.maintainerAffiliation.value as string
      }
    }
  }

  /**
   * Returns true if at least one field has a validation error.
   */
  hasInvalidFields(): boolean {
    return _.some(this.fields, (field, key) => field.invalidMsg != undefined)
  }

  /**
   * Assigns clicked value and hides dropdown.
   * @param $event
   * @param obj
   * @param value
   */
  setDropdownValue($event: MouseEvent, obj: Field, value: string) {
    obj.value = value
    this.hideMenu($event)
  }

  hideMenu($event: MouseEvent) {
    if ($event.target) {
      const menu = $($event.target).closest('.dropdown-menu')
      menu.css('display', 'none')
      setTimeout(() => menu.css('display', ''), 100)
    }
  }

  reset() {
    this.submitMsg = null
    this.fields = _.cloneDeep(FIELDS)
    this.fieldsList = _.map<MetaForm, FieldEmbed>(this.fields, (obj: Field, key: string) => {
      return {key: key, obj: obj}
    })
    this.refreshDatasetId()
  }

  submit() {
    this.validate()

    if (this.hasInvalidFields()) {
      this.showFirstValidationError()
    } else {

      const meta: Dataset = this.as_dataset()
      const notes = this.fields.submissionNotes.value as string

      this.busy = true
      this.submitMsg = null
      this.backend.submitDatasetMeta(meta, notes).subscribe({
        next: (msg: SubmitMetaResult) => {
          this.busy = false
          this.submitMsg = {
            title: "Thank you! Your dataset submission request has been successfully received. Our team will review the details and notify you once a decision has been made.",
            detail: msg && msg.details,
            type: 'success'
          }
        },
        error: err => {
          this.busy = false
          this.submitMsg = {
            title: "Your dataset could not be submitted",
            detail: err?.error?.detail || err.statusText,
            type: 'error'
          }
          console.log('SUBMISSION ERROR', err)
        }
      })
    }
  }

  showFirstValidationError() {
    const key = _.findKey(this.fields, (field, key) => field.invalidMsg != undefined) as keyof MetaForm
    if (!key) return
    const field = this.fields[key]
    this.showValidationError(key, field)

  }

  showValidationError(key: string, field: Field) {
    const id = `#${key}`
    const fieldDiv = $(id)
    if (!fieldDiv) return
    $('html, body').animate({scrollTop: fieldDiv?.offset()?.top}, 50)
  }

  showSubmissionForm = () => !this.busy && this.submitMsg == null

}
