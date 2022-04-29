import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ISubscriptionPlan, SubscriptionPlan } from '../subscription-plan.model';
import { SubscriptionPlanService } from '../service/subscription-plan.service';

import { SubscriptionPlanRoutingResolveService } from './subscription-plan-routing-resolve.service';

describe('SubscriptionPlan routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SubscriptionPlanRoutingResolveService;
  let service: SubscriptionPlanService;
  let resultSubscriptionPlan: ISubscriptionPlan | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(SubscriptionPlanRoutingResolveService);
    service = TestBed.inject(SubscriptionPlanService);
    resultSubscriptionPlan = undefined;
  });

  describe('resolve', () => {
    it('should return ISubscriptionPlan returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSubscriptionPlan = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSubscriptionPlan).toEqual({ id: 123 });
    });

    it('should return new ISubscriptionPlan if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSubscriptionPlan = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSubscriptionPlan).toEqual(new SubscriptionPlan());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SubscriptionPlan })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSubscriptionPlan = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSubscriptionPlan).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});