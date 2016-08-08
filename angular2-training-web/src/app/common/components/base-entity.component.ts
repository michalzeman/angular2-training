import {OnInit, OnDestroy} from "@angular/core";
import {Router, ActivatedRoute}       from '@angular/router';
import {BaseEntity} from "../entities/baseEntity";
import {EntityService} from "../services/entity/base-entity.service";
import {FormControlService} from "../templates/form-control.service";
import {ControlGroup} from "@angular/common";
import {FormMetadata} from "../templates/domain-metadata";
import {Observable}     from 'rxjs/Rx';
import {BaseDomainTemplate} from "../templates/baseDomain.template";

export abstract class BaseEntityComponent<E extends BaseEntity> implements OnInit, OnDestroy {

  // model: E;

  form: ControlGroup;

  formMetadata: FormMetadata<any>[];

  title: string;

  protected sub: any;

  constructor(protected entityService: EntityService<E>,
              protected formControlService: FormControlService,
              protected route: ActivatedRoute,
              protected router: Router,
              protected domainTemplate:BaseDomainTemplate<E>) {
  }

  /**
   * This is called when component is created
   * @returns {null}
   */
  ngOnInit() {
    console.log('ngOnInit() ->');
    this.title = this.getTitle();
    this.sub = this.route.params.subscribe(
      params => {
        if (params['id']) {
          let id: number = +params['id'];
          this.get(id).subscribe(entity => {
            console.debug('Test get()-> ', entity);
            // this.buildFormControlGroup(entity)
          });
        } else {
          this.buildFormControlGroup(undefined);
        }
      }
    );
  }

  protected abstract getTitle(): string;


  /**
   * build form ControlGroup for dynamic form
   * @param entity
   */
  protected buildFormControlGroup(entity: E) {
    console.debug('buildFormControlGroup ->', entity);
    this.formMetadata = this.mapDomainFormMetadata(entity);
    this.form = this.formControlService.getControlGroup(this.formMetadata);
  }

  /**
   * map Domain object to form metadata array
   * @param entity
   */
  abstract mapDomainFormMetadata(entity: E): FormMetadata<any>[];

  get(id: number) {
    console.debug('get() ->');
    return Observable.create(observer => {
      this.entityService.get(id).subscribe(
        entity => {
          this.buildFormControlGroup(entity);
          observer.next(entity);
          observer.complete(); // end of created observer
        })
    });
  }

  save(entity: E): void {
    console.debug('save() ->');
    this.entityService.save(entity).subscribe(
      entity => this.buildFormControlGroup(entity)
    );
  }

  update(entity: E): void {
    console.debug('update() ->');
    this.entityService.update(entity).subscribe(
      // entity => this.buildFormControlGroup(entity)
      result => this.goBack()
    );
  }

  deleteEntity(entity: E): void {
    console.debug('deleteEntity() ->')
    this.entityService.delete(entity);
  }

  onSubmit() {
    console.debug('onSubmit() ->', this.form.value);
    let model = <E>this.form.value;
    if (model && model.id) {
      this.update(model);
    } else {
      this.save(model);
    }
  }

  /**
   * Go back
   */
  goBack(): void {
    // TODO: find proper implementation for navigation back, now it is hardcoded
    this.router.navigate([this.domainTemplate.getTableUrl()]);
  }

  ngOnDestroy() {
    console.debug('getAll() ->');
    this.sub.unsubscribe();
  }

}
