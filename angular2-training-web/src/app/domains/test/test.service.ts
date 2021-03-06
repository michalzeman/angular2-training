import {BaseEntityServiceImpl} from "../../common/services/entity/base-entity.service";
import {Test} from "./test";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {DelegateService} from "../../common/services/delegate.service";
import {Observable} from "rxjs/Rx";
import {GetAllPagination} from "../../common/entities/get-all.pagination";

@Injectable()
export class TestService extends BaseEntityServiceImpl<Test> {

  resultList: Array<Test> = [
    {
      id: 1,
      name: "Test",
      desc: true
    },
    {
      id: 2,
      name: "Test",
      desc: false
    },
    {
      id: 3,
      name: "Test",
      itemId: 7,
      desc: true
    }];

  constructor(delegateService: DelegateService, http: Http) {
    super(delegateService, http, '/tests');
  }


  get(id: number): Observable<Test> {
    console.debug('TestCrudServer.get() -> ', id);
    return Observable.from(this.resultList.filter(item => item.id == id));
  }

  getAll(): Observable<Test[]> {
    console.debug('get');
    return Observable.create(observer => {
      observer.next(this.resultList);
    })
  }


  getAllPagination(page: number, items: number): Observable<GetAllPagination<Test>> {
    let paginationResult: GetAllPagination<Test> = {
      result: this.resultList,
      page: page,
      sizePerPage: 10,
      size: 3
    };
    return Observable.of(paginationResult);
  }
}
