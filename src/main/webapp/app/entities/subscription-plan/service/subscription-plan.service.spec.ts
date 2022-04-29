import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { SubscriptionType } from 'app/entities/enumerations/subscription-type.model';
import { SubscriptionStatus } from 'app/entities/enumerations/subscription-status.model';
import { ISubscriptionPlan, SubscriptionPlan } from '../subscription-plan.model';

import { SubscriptionPlanService } from './subscription-plan.service';

describe('SubscriptionPlan Service', () => {
  let service: SubscriptionPlanService;
  let httpMock: HttpTestingController;
  let elemDefault: ISubscriptionPlan;
  let expectedResult: ISubscriptionPlan | ISubscriptionPlan[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SubscriptionPlanService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      subscriptionName: 'AAAAAAA',
      subscriptionTitle: 'AAAAAAA',
      subscriptionType: SubscriptionType.FREE,
      subscriptionPrice: 0,
      subscriptionQuantity: 0,
      subscriptionPeriod: 0,
      subscriptionTerms: 'AAAAAAA',
      status: SubscriptionStatus.INACTIVE,
      createdDate: currentDate,
      updatedDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          createdDate: currentDate.format(DATE_TIME_FORMAT),
          updatedDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a SubscriptionPlan', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          createdDate: currentDate.format(DATE_TIME_FORMAT),
          updatedDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdDate: currentDate,
          updatedDate: currentDate,
        },
        returnedFromService
      );

      service.create(new SubscriptionPlan()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SubscriptionPlan', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          subscriptionName: 'BBBBBB',
          subscriptionTitle: 'BBBBBB',
          subscriptionType: 'BBBBBB',
          subscriptionPrice: 1,
          subscriptionQuantity: 1,
          subscriptionPeriod: 1,
          subscriptionTerms: 'BBBBBB',
          status: 'BBBBBB',
          createdDate: currentDate.format(DATE_TIME_FORMAT),
          updatedDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdDate: currentDate,
          updatedDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SubscriptionPlan', () => {
      const patchObject = Object.assign(
        {
          subscriptionName: 'BBBBBB',
          subscriptionTitle: 'BBBBBB',
          subscriptionPeriod: 1,
          status: 'BBBBBB',
          createdDate: currentDate.format(DATE_TIME_FORMAT),
          updatedDate: currentDate.format(DATE_TIME_FORMAT),
        },
        new SubscriptionPlan()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          createdDate: currentDate,
          updatedDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SubscriptionPlan', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          subscriptionName: 'BBBBBB',
          subscriptionTitle: 'BBBBBB',
          subscriptionType: 'BBBBBB',
          subscriptionPrice: 1,
          subscriptionQuantity: 1,
          subscriptionPeriod: 1,
          subscriptionTerms: 'BBBBBB',
          status: 'BBBBBB',
          createdDate: currentDate.format(DATE_TIME_FORMAT),
          updatedDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdDate: currentDate,
          updatedDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a SubscriptionPlan', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSubscriptionPlanToCollectionIfMissing', () => {
      it('should add a SubscriptionPlan to an empty array', () => {
        const subscriptionPlan: ISubscriptionPlan = { id: 123 };
        expectedResult = service.addSubscriptionPlanToCollectionIfMissing([], subscriptionPlan);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(subscriptionPlan);
      });

      it('should not add a SubscriptionPlan to an array that contains it', () => {
        const subscriptionPlan: ISubscriptionPlan = { id: 123 };
        const subscriptionPlanCollection: ISubscriptionPlan[] = [
          {
            ...subscriptionPlan,
          },
          { id: 456 },
        ];
        expectedResult = service.addSubscriptionPlanToCollectionIfMissing(subscriptionPlanCollection, subscriptionPlan);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SubscriptionPlan to an array that doesn't contain it", () => {
        const subscriptionPlan: ISubscriptionPlan = { id: 123 };
        const subscriptionPlanCollection: ISubscriptionPlan[] = [{ id: 456 }];
        expectedResult = service.addSubscriptionPlanToCollectionIfMissing(subscriptionPlanCollection, subscriptionPlan);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(subscriptionPlan);
      });

      it('should add only unique SubscriptionPlan to an array', () => {
        const subscriptionPlanArray: ISubscriptionPlan[] = [{ id: 123 }, { id: 456 }, { id: 2315 }];
        const subscriptionPlanCollection: ISubscriptionPlan[] = [{ id: 123 }];
        expectedResult = service.addSubscriptionPlanToCollectionIfMissing(subscriptionPlanCollection, ...subscriptionPlanArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const subscriptionPlan: ISubscriptionPlan = { id: 123 };
        const subscriptionPlan2: ISubscriptionPlan = { id: 456 };
        expectedResult = service.addSubscriptionPlanToCollectionIfMissing([], subscriptionPlan, subscriptionPlan2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(subscriptionPlan);
        expect(expectedResult).toContain(subscriptionPlan2);
      });

      it('should accept null and undefined values', () => {
        const subscriptionPlan: ISubscriptionPlan = { id: 123 };
        expectedResult = service.addSubscriptionPlanToCollectionIfMissing([], null, subscriptionPlan, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(subscriptionPlan);
      });

      it('should return initial array if no SubscriptionPlan is added', () => {
        const subscriptionPlanCollection: ISubscriptionPlan[] = [{ id: 123 }];
        expectedResult = service.addSubscriptionPlanToCollectionIfMissing(subscriptionPlanCollection, undefined, null);
        expect(expectedResult).toEqual(subscriptionPlanCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});