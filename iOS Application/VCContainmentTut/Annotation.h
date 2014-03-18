//Annotation.h

#import <Foundation/Foundation.h>
#import <MapKit/MapKit.h>

typedef NS_ENUM(NSInteger, PVAttractionType) {
    PVAttractionAtixima=1,
    PVAttractionDromena=2,
    PVAttractionAstikos=3,
    PVAttractionInfo=4,
    PVAttractionPories=5
};

@interface Annotation : NSObject<MKAnnotation> {
 /*
    CLLocationCoordinate2D coordinate;
    NSString *title;
    NSString *subtitle;
    NSString *alertID;
    NSString *alertType;
    NSString *alertImage;
    NSString *alertTime;
    NSString *alertAddress;
    PVAttractionType type;
*/
}

@property (nonatomic, readonly) CLLocationCoordinate2D coordinate;
@property (nonatomic,readonly,copy) NSString *title;
@property (nonatomic,readonly,copy) NSString *subtitle;
@property (nonatomic,readonly,copy) NSString *alertType;
@property (nonatomic,readonly,copy) NSString *alertImage;
@property (nonatomic,readonly,copy) NSString *alertTime;
@property (nonatomic,readonly,copy) NSString *alertAddress;
@property (nonatomic,readonly,copy) NSString *alertID;
@property (nonatomic) PVAttractionType type;


- (id)initWithCoordinates:(CLLocationCoordinate2D)location placeName:(NSString *)placeName description:(NSString *)description alertid:(NSString *)alertidVal alertType:(NSString *)alertTypeVal alertImage:(NSString *)alertImageVal alertTime:(NSString *)alertTimeVal alertAddress:(NSString *)alertAddressVal type:(PVAttractionType)types;

@end