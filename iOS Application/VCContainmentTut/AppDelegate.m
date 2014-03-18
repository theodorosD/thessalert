//
//  AppDelegate.m
//  VCContainmentTut
//
//  Created by A Khan on 01/05/2013.
//  Copyright (c) 2013 AK. All rights reserved.
//

#import "AppDelegate.h"
#import "AFNetworkReachabilityManager.h"
#import "RootController.h"
#import "ViewController.h"
#import <Parse/Parse.h>

@implementation AppDelegate
UIStoryboard *navStoryBoard;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

    [[AFNetworkReachabilityManager sharedManager] startMonitoring];

    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    [application setStatusBarHidden:NO];
    [application setStatusBarStyle:UIStatusBarStyleDefault];
  
    //UIStoryboard *tabStoryBoard = [UIStoryboard storyboardWithName:@"TabStoryboard" bundle:nil];
    navStoryBoard = [UIStoryboard storyboardWithName:@"NavStoryboard" bundle:nil];
    //UINavigationController *navController = [navStoryBoard instantiateViewControllerWithIdentifier:@"Nav Controller"];
    //UITabBarController *tabController = [tabStoryBoard instantiateViewControllerWithIdentifier:@"Tab Controller"];
    
    ViewController *redVC, *greenVC;
    redVC = [[ViewController alloc] init];
    greenVC = [[ViewController alloc] init];
    redVC.view.backgroundColor = [UIColor redColor];
    greenVC.view.backgroundColor = [UIColor greenColor];
    
    ViewController *allAlerts = (ViewController *)[navStoryBoard instantiateViewControllerWithIdentifier:@"allalerts"];
    ViewController *kykloalerts = (ViewController *)[navStoryBoard instantiateViewControllerWithIdentifier:@"kyklo_alerts"];
    ViewController *politalerts = (ViewController *)[navStoryBoard instantiateViewControllerWithIdentifier:@"polit_alerts"];
    ViewController *poriesAlerts = (ViewController *)[navStoryBoard instantiateViewControllerWithIdentifier:@"alerts_pories"];
     ViewController *infoAlerts = (ViewController *)[navStoryBoard instantiateViewControllerWithIdentifier:@"info_alerts"];
     ViewController *astikosAlerts = (ViewController *)[navStoryBoard instantiateViewControllerWithIdentifier:@"asti_alerts"];

    RootController *menuController = [[RootController alloc]
                                      initWithViewControllers:@[ allAlerts,kykloalerts,politalerts,astikosAlerts,infoAlerts,poriesAlerts]
                                      andMenuTitles:@[@"Όλα τα συμβάντα",@"Κυκλοφοριακό/Ατύχημα",@"Πολιτιστικά Δρώμενα",@"Επικίνδυνα σημεία",@"Χρήσιμες πληροφορίες",@"Πορείες/Διαδηλώσεις"]];
    
    self.window.rootViewController = menuController;
    self.window.backgroundColor = [UIColor colorWithRed:236/255.0 green:240/255.0 blue:241/255.0 alpha:1.0f];
    [self.window makeKeyAndVisible];
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    if (![defaults boolForKey:@"everLaunched"]) {
     
        [defaults setBool:YES forKey:@"everLaunched"];
        [defaults setObject:@"" forKey:@"lastLat"];
        [defaults setObject:@"" forKey:@"lastLng"];
        [defaults setObject:@"" forKey:@"zoom"];
        [defaults setBool:NO forKey:@"misc1"];
        [defaults setObject:@"" forKey:@"misc2"];
        [defaults setObject:@"" forKey:@"misc3"];
        [defaults setObject:@"" forKey:@"misc4"];
        [defaults synchronize];
    }
    [Parse setApplicationId:@"YOUR PARSE APP ID"
                  clientKey:@"YOUR PARSE CLIENT KEY"];
    
    [application registerForRemoteNotificationTypes:UIRemoteNotificationTypeBadge|
     UIRemoteNotificationTypeAlert|
     UIRemoteNotificationTypeSound];
    return YES;
}

- (void)application:(UIApplication *)application
didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
    // Store the deviceToken in the current installation and save it to Parse.
    PFInstallation *currentInstallation = [PFInstallation currentInstallation];
    [currentInstallation setDeviceTokenFromData:deviceToken];
    [currentInstallation saveInBackground];
}

- (void)application:(UIApplication *)application
didReceiveRemoteNotification:(NSDictionary *)userInfo {
    [PFPush handlePush:userInfo];
}

@end
