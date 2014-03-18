//
//  doy.m
//  VCContainmentTut
//
//  Created by Θεόδωρος Δεληγιαννίδης on 8/26/13.
//  Copyright (c) 2013 AK. All rights reserved.
//

#import "doy.h"
#import "ViewController.h"
#import "AppDelegate.h"

#import "Annotation.h"
#import "PVAttractionAnnotationView.h"
#import "AFNetworking.h"
#import "postAlertViewController.h"

#import "SettingsView.h"
#import <QuartzCore/QuartzCore.h>

@interface doy (){
NSArray *markerArray;
    NSString *latJSON;
    NSString *lngJSON;
    NSString *alertID;
    NSString *alertType;

}
@property (nonatomic, strong) CLGeocoder *geocoder;
@property (nonatomic, strong) MKPlacemark *placemark;

@end
#define METERS_PER_MILE 1609.344
#define DEFAULTS NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];

bool hasit=false;

@implementation doy
@synthesize mapView;
- (void)willMoveToParentViewController:(UIViewController *)parent
{
}

- (void)didMoveToParentViewController:(UIViewController *)parent
{
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    
    //UILongPressGestureRecognizer *longPressGesture = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(handleLongPressGesture:)];
    //[self.mapView addGestureRecognizer:longPressGesture];
    
    UIButton *btn = [UIButton buttonWithType:UIButtonTypeDetailDisclosure];
    [btn addTarget:self action:@selector(showSettings) forControlEvents:UIControlEventTouchUpInside];
    UIBarButtonItem *settingBtn = [[UIBarButtonItem alloc] initWithCustomView:btn];
    [[self navigationItem] setRightBarButtonItem:settingBtn];

    refreshMapImg=[[UIImageView alloc]initWithImage:[UIImage imageNamed:@"01-refresh.png"]];
    userLocationImg=[[UIImageView alloc]initWithImage:[UIImage imageNamed:@"193-location-arrow.png"]];
    UIImageView *addAlertImg=[[UIImageView alloc]initWithImage:[UIImage imageNamed:@"add-icon.png"]];
    
    refreshMapImg.frame=CGRectMake(10, self.view.frame.size.height-refreshMapImg.frame.size.height-30, refreshMapImg.frame.size.width, refreshMapImg.frame.size.height);
    
    addAlertImg.frame=CGRectMake(self.view.frame.size.width/2-addAlertImg.frame.size.width/2, self.view.frame.size.height-20-addAlertImg.frame.size.height, addAlertImg.frame.size.width, addAlertImg.frame.size.height);
    
    userLocationImg.frame=CGRectMake(self.view.frame.size.width-userLocationImg.frame.size.width-20, self.view.frame.size.height-30-userLocationImg.frame.size.width, 32, 32);
   
    
    activityIndicator = [[UIActivityIndicatorView alloc]initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleGray];
    activityIndicator.frame = CGRectMake(10, self.view.frame.size.height-refreshMapImg.frame.size.height-30, refreshMapImg.frame.size.width, refreshMapImg.frame.size.height);
    //activityIndicator.center = self.view.center;
    
    UITapGestureRecognizer *refreshGest=[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(refreshMap)];
    UITapGestureRecognizer *moveuserGest=[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(moveMapToUserLoc)];
    UITapGestureRecognizer *addAlertGest=[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(showActionSheet:)];

    [refreshMapImg addGestureRecognizer:refreshGest];
    [userLocationImg addGestureRecognizer:moveuserGest];
    [addAlertImg addGestureRecognizer:addAlertGest];
    
    refreshMapImg.userInteractionEnabled=YES;
    userLocationImg.userInteractionEnabled=NO;
    addAlertImg.userInteractionEnabled=YES;
    mapView.tintColor=[UIColor blackColor];
    [self.view addSubview:refreshMapImg];
    [self.view addSubview:userLocationImg];
    [self.view addSubview:addAlertImg];
    [self.view addSubview: activityIndicator];
    
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    // Create a geocoder and save it for later.
    self.geocoder = [[CLGeocoder alloc] init];
    [self refreshMap];
}

- (void)viewDidLoad
{
    [[NSUserDefaults standardUserDefaults] setObject: [NSArray arrayWithObjects:@"el", nil] forKey:@"AppleLanguages"];
    [[NSUserDefaults standardUserDefaults] synchronize]; //to make the change immediate
    
    if([CLLocationManager locationServicesEnabled] &&
       [CLLocationManager authorizationStatus] != kCLAuthorizationStatusDenied)
    {
        //NSLog(@"LOCATION ENABLED");
    }else
    {
        UIAlertView *message = [[UIAlertView alloc] initWithTitle:@"Δεν βρέθηκε η τοποθεσία σας"
                                                          message:@"Παρακαλώ, ενεργοποιήστε τις υπηρεσίες τοποθεσίας από τις Ρυθμίσεις->Απόρρητο->Υπηρεσίες Τοποθεσίας, όπως και για την εφαρμογή 'Θεσσαλονίκη Alert' από την λίστα. Η εφαρμογή χρησιμοποιεί αυτόματα την τοποθεσία σας για την αποστολή συμβάντος."
                                                         delegate:nil
                                                cancelButtonTitle:@"Εντάξει"
                                                otherButtonTitles:nil];
        [message show];
    }
    
    //DEFAULTS;
    mapView.showsUserLocation=YES;
    
    if (self.mapView.userLocation.location) {
        self.mapView.centerCoordinate = self.mapView.userLocation.location.coordinate;
        MKCoordinateRegion viewRegion = MKCoordinateRegionMakeWithDistance(self.mapView.userLocation.location.coordinate, 0.2*METERS_PER_MILE, 5.5*METERS_PER_MILE);
        [self.mapView setRegion:viewRegion animated:YES];
    }else{
        CLLocationCoordinate2D zoomLocation;
        zoomLocation.latitude =40.629718;
        zoomLocation.longitude=22.951126;
        MKCoordinateRegion viewRegion = MKCoordinateRegionMakeWithDistance(zoomLocation, 5.2*METERS_PER_MILE, 5.5*METERS_PER_MILE);
        [self.mapView setRegion:[self.mapView regionThatFits:viewRegion] animated:YES];
    }
    self.mapView.delegate = self;
}

-(void)moveMapToUserLoc
{
    if (CLLocationCoordinate2DIsValid(userLocationCoords)==YES)
    {
        [mapView setCenterCoordinate:mapView.userLocation.location.coordinate animated:YES];

    }else{
        UIAlertView *message = [[UIAlertView alloc] initWithTitle:@"Δεν βρέθηκε η τοποθεσία σας"
                                                          message:@"Παρακαλώ, ενεργοποιήστε τις υπηρεσίες τοποθεσίας από τις Ρυθμίσεις->Απόρρητο->Υπηρεσίες Τοποθεσίας, όπως και για την εφαρμογή 'Θεσσαλονίκη Alert' από την λίστα. Η εφαρμογή χρησιμοποιεί αυτόματα την τοποθεσία σας για την αποστολή συμβάντος."
                                                         delegate:nil
                                                cancelButtonTitle:@"Εντάξει"
                                                otherButtonTitles:nil];
        [message show];
    }
}
-(void)threadStartAnimating:(id)data
{
    refreshMapImg.hidden=YES;
    [activityIndicator startAnimating];
}
-(void)refreshMap
{
    [NSThread detachNewThreadSelector:@selector(threadStartAnimating:) toTarget:self withObject:nil];

    for (id annotation in self.mapView.annotations) {
        [self.mapView removeAnnotation:annotation];
    }
    
    NSString *markersJSON=[NSString stringWithFormat:@"http://localhost/markers_json.php?alt=%ld",(long)self.view.tag];
    AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    manager.responseSerializer = [AFJSONResponseSerializer serializer];
    [manager GET:markersJSON      parameters:nil success:^(AFHTTPRequestOperation *operation, id responseObject) {         markerArray = [responseObject valueForKey:@"places"];
        for (NSDictionary *jsonObj in markerArray ){
            latJSON=[jsonObj objectForKey:@"lat"];
            lngJSON=[jsonObj objectForKey:@"lng"];
            CLLocationCoordinate2D myCoordinate = {[latJSON doubleValue], [lngJSON doubleValue]};
            Annotation *pin = [[Annotation alloc] initWithCoordinates:myCoordinate placeName:[jsonObj objectForKey:@"title"] description:[jsonObj objectForKey:@"description"] alertid:[jsonObj objectForKey:@"id"] alertType:[jsonObj objectForKey:@"alerttypeid"] alertImage:[jsonObj objectForKey:@"image"] alertTime:[jsonObj objectForKey:@"time"] alertAddress:[jsonObj objectForKey:@"address"] type:[[jsonObj objectForKey:@"alerttypeid"]integerValue] ];
            [self.mapView addAnnotation:pin];
        }
        [activityIndicator stopAnimating];
        refreshMapImg.hidden=NO;
    } failure:nil];
   

}

-(void)addAlert:(NSInteger)alertId
{
    if (CLLocationCoordinate2DIsValid(userLocationCoords)==YES &&!userLocationCoords.latitude==0.000000 && self.placemark!=NULL)
    {
      
        postAlertViewController *postAlertView = [self.storyboard  instantiateViewControllerWithIdentifier:@"postAlert"];
        postAlertView.alertPassType=alertId;
        postAlertView.userLocationCoords=userLocationCoords;
        postAlertView.placemark=self.placemark;
        UIBarButtonItem *backButton = [[UIBarButtonItem alloc]
                                       initWithTitle: @"Πίσω"
                                       style: UIBarButtonItemStyleBordered
                                       target: nil action: nil];
        postAlertView.title=@"Νέο συμβάν";
        [self.navigationItem setBackBarButtonItem:backButton];
        [self.navigationController pushViewController:postAlertView animated:YES];
       
    }else{
        UIAlertView *message = [[UIAlertView alloc] initWithTitle:@"Δεν βρέθηκε η τοποθεσία σας"
                                                          message:@"Παρακαλώ, ενεργοποιήστε τις υπηρεσίες τοποθεσίας από τις Ρυθμίσεις->Απόρρητο->Υπηρεσίες Τοποθεσίας, όπως και για την εφαρμογή 'Θεσσαλονίκη Alert' από την λίστα. Η εφαρμογή χρησιμοποιεί αυτόματα την τοποθεσία σας για την αποστολή συμβάντος."
                                                         delegate:nil
                                                cancelButtonTitle:@"Εντάξει"
                                                otherButtonTitles:nil];
        [message show];

    }
}
-(void)showSettings
{
    SettingsView *settingsView = [self.storyboard  instantiateViewControllerWithIdentifier:@"settings"];
    UIBarButtonItem *backButton = [[UIBarButtonItem alloc]
                                   initWithTitle: @"Πίσω"
                                   style: UIBarButtonItemStyleBordered
                                   target: nil action: nil];
    [self.navigationItem setBackBarButtonItem: backButton];
    [self.navigationController pushViewController:settingsView animated:YES];
    

}
- (void)mapView:(MKMapView *)aMapView didUpdateUserLocation:(MKUserLocation *)aUserLocation {
    userLocationCoords.latitude=aUserLocation.coordinate.latitude;
    userLocationCoords.longitude=aUserLocation.coordinate.longitude;
    if (aUserLocation.location.horizontalAccuracy > 0) {
        //[self moveMapToUserLoc];
    }
    // Lookup the information for the current location of the user.
    [self.geocoder reverseGeocodeLocation:self.mapView.userLocation.location completionHandler:^(NSArray *placemarks, NSError *error) {
		if ((placemarks != nil) && (placemarks.count > 0)) {
			// If the placemark is not nil then we have at least one placemark. Typically there will only be one.
			_placemark = [placemarks objectAtIndex:0];
            userLocationImg.userInteractionEnabled=YES;
		}
		else {
			// Handle the nil case if necessary.
            
		}
    }];
   // NSLog(@"%@", self.placemark.thoroughfare);
}

- (MKAnnotationView *)mapView:(MKMapView *)mapView viewForAnnotation:(id <MKAnnotation>)annotation {
    static NSString *AnnotationViewID = @"annotationViewID";
      if([annotation isKindOfClass:[MKUserLocation class]])
    {
        ((MKUserLocation *)annotation).title = @"Βρίσκεστε εδώ";
    return nil;
    }
    
    //PVAttractionAnnotationView *annotationView = (PVAttractionAnnotationView *)[self.mapView dequeueReusableAnnotationViewWithIdentifier:AnnotationViewID];
    PVAttractionAnnotationView *annotationView = [[PVAttractionAnnotationView alloc] initWithAnnotation:annotation reuseIdentifier:AnnotationViewID];
    

   if (annotationView==nil)
    {
        annotationView = [[PVAttractionAnnotationView alloc] initWithAnnotation:annotation reuseIdentifier:AnnotationViewID];

    }else{
        annotationView.annotation = annotation;

    }
   
    annotationView.canShowCallout=YES;
    annotationView.rightCalloutAccessoryView =[UIButton buttonWithType:UIButtonTypeInfoLight];
    annotationView.canShowCallout = YES;
    annotationView.alpha=0.0;
    return annotationView;
}
- (void)mapViewDidFinishLoadingMap:(MKMapView *)mapView
{
}
- (void)mapView:(MKMapView *)mapView regionDidChangeAnimated:(BOOL)animated
{
    /*DEFAULTS;
    MKCoordinateRegion mapRegion;
    mapRegion.center = self.mapView.centerCoordinate;
    MKZoomScale currentZoomScale = self.mapView.bounds.size.width / self.mapView.visibleMapRect.size.width;
    double lat = mapRegion.center.latitude;
    double lng = mapRegion.center.longitude;
    [defaults setObject:[NSString stringWithFormat:@"%g", lat] forKey:@"lastLat"];
    [defaults setObject:[NSString stringWithFormat:@"%g", lng] forKey:@"lastLng"];
    [defaults setObject:[NSString stringWithFormat:@"%g", currentZoomScale] forKey:@"zoom"];
    [defaults synchronize];
    NSLog(@"%@ %@ %@",[defaults stringForKey:@"lastLat"],[defaults stringForKey:@"lastLng"],[defaults stringForKey:@"zoom"]);
    */
}

- (void)mapView:(MKMapView *)map annotationView:(MKAnnotationView *)view calloutAccessoryControlTapped:(UIControl *)control;
{
    
    ViewController *yourViewController = (ViewController *)[navStoryBoard instantiateViewControllerWithIdentifier:@"details_alert"];
    Annotation *mysc=view.annotation;
    [yourViewController setValue:mysc.title forKey:@"sendAlertTitle"];
    [yourViewController setValue:mysc.subtitle forKey:@"sendAlertDescr"];
    [yourViewController setValue:mysc.alertTime forKey:@"sendAlertDate"];
    [yourViewController setValue:mysc.alertAddress forKey:@"sendAlertaddress"];
    [yourViewController setValue:mysc.alertImage forKey:@"sendAlertImage"];
    UIBarButtonItem *backButton = [[UIBarButtonItem alloc]
                                   initWithTitle: @"Πίσω"
                                   style: UIBarButtonItemStyleBordered
                                   target: nil action: nil];
    [self.navigationItem setBackBarButtonItem: backButton];
    [self.navigationController pushViewController:yourViewController animated:YES];

}

- (void)mapView:(MKMapView *)mapView didSelectAnnotationView:(MKAnnotationView *)view
{
}


- (void)willRotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration
{
    [super willRotateToInterfaceOrientation:toInterfaceOrientation duration:duration];
}

- (void)didRotateFromInterfaceOrientation:(UIInterfaceOrientation)fromInterfaceOrientation
{
    [super didRotateFromInterfaceOrientation:fromInterfaceOrientation];
}
- (void)showActionSheet:(id)sender
{
    NSString *actionSheetTitle = @"Επιλέξτε κατηγορία συμβάντος"; //Action Sheet Title
    
    NSString *kyklo = @"Κυκλοφοριακό/Ατύχημα";
    NSString *dromena=@"Πολιτιστικά Δρώμενα";
    NSString *astikos=@"Επικίνδυνα σημεία";
    NSString *infos=@"Χρήσιμες πληροφορίες";
    NSString *poria=@"Πορείες/Διαδηλώσεις";
    NSString *cancelTitle = @"Άκυρο";
   
        UIActionSheet *actionSheet = [[UIActionSheet alloc]
                                      initWithTitle:actionSheetTitle
                                      delegate:self
                                      cancelButtonTitle:cancelTitle
                                      destructiveButtonTitle:nil
                                      otherButtonTitles:kyklo,dromena,astikos,infos,poria, nil];
        [actionSheet showInView:self.view];
}

- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex
{
    NSString *buttonTitle = [actionSheet buttonTitleAtIndex:buttonIndex];
    if  ([buttonTitle isEqualToString:@"Κυκλοφοριακό/Ατύχημα"]) {
        [self addAlert:1];
    }
    if  ([buttonTitle isEqualToString:@"Πολιτιστικά Δρώμενα"]) {
        [self addAlert:2];
    }
    if  ([buttonTitle isEqualToString:@"Επικίνδυνα σημεία"]) {
        [self addAlert:3];
    }if  ([buttonTitle isEqualToString:@"Χρήσιμες πληροφορίες"]) {
        [self addAlert:4];
    }if  ([buttonTitle isEqualToString:@"Πορείες/Διαδηλώσεις"]) {
        [self addAlert:5];
    }
    
}
- (void)mapViewDidFinishRenderingMap:(MKMapView *)mapView fullyRendered:(BOOL)fullyRendered
{
}
- (void)mapView:(MKMapView *)mapView
didAddAnnotationViews:(NSArray *)annotationViews
{
    for (MKAnnotationView *annView in annotationViews)
    {        [UIView animateWithDuration:1.0
                              delay:0.7
                            options: UIViewAnimationOptionCurveEaseIn
                         animations:^{annView.alpha=1.0f;}
                         completion:nil];

        //[UIView animateWithDuration:1.0
                        // animations:^{ annView.alpha=1.0f;}];//annView.frame = endFrame;
    }
    
}
/*- (void)mapView:(MKMapView *)mapView didAddAnnotationViews:(NSArray *)annotationViews {
    MKAnnotationView *aV;
    
    float delay = 0.00;
    
    for (aV in annotationViews) {
        CGRect endFrame = aV.frame;
        
        aV.frame = CGRectMake(aV.frame.origin.x, aV.frame.origin.y - 430.0, aV.frame.size.width, aV.frame.size.height);
        delay = delay + 0.5;
        
        [UIView beginAnimations:nil context:NULL];
        [UIView setAnimationDelay:delay];
        [UIView setAnimationDuration:0.45];
        [UIView setAnimationCurve:UIViewAnimationCurveEaseInOut];
        [aV setFrame:endFrame];
        [UIView commitAnimations];
    }
}
*/

/*-(void)handleLongPressGesture:(UIGestureRecognizer*)sender {
    // This is important if you only want to receive one tap and hold event
    if (sender.state == UIGestureRecognizerStateEnded || sender.state == UIGestureRecognizerStateChanged)
        return;
    
        // Here we get the CGPoint for the touch and convert it to latitude and longitude coordinates to display on the map
        CGPoint point = [sender locationInView:self.mapView];
        CLLocationCoordinate2D locCoord = [self.mapView convertPoint:point toCoordinateFromView:self.mapView];
        // Then all you have to do is create the annotation and add it to the map
        Annotation *dropPin = [[Annotation alloc] initWithCoordinates:locCoord placeName:@"dsa" description:nil alertid:nil alertType:nil alertImage:nil alertTime:nil alertAddress:nil type:1];
        //dropPin.latitude = [NSNumber numberWithDouble:locCoord.latitude];
        //dropPin.longitude = [NSNumber numberWithDouble:locCoord.longitude];
        [self.mapView addAnnotation:dropPin];
    
}*/
/*- (void)mapView:(MKMapView *)mv didAddAnnotationViews:(NSArray *)views
{
	MKAnnotationView *annotationView = [views objectAtIndex:0];
	id <MKAnnotation> mp = [annotationView annotation];
	MKCoordinateRegion region = MKCoordinateRegionMakeWithDistance([mp coordinate], 1500, 1500);
	//[mv setRegion:region animated:YES];
	//[mv selectAnnotation:mp animated:YES];
}*/

@end
