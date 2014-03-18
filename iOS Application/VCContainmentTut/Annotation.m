//Annotation.m

#import "Annotation.h"

@implementation Annotation

@synthesize coordinate;
@synthesize title;
@synthesize subtitle;
//@synthesize alertAddress;
//@synthesize alertImage,alertTime,alertType,alertID,type;


- (id)initWithCoordinates:(CLLocationCoordinate2D)location placeName:(NSString *)placeName description:(NSString *)description alertid:(NSString *)alertidVal alertType:(NSString *)alertTypeVal alertImage:(NSString *)alertImageVal alertTime:(NSString *)alertTimeVal alertAddress:(NSString *)alertAddressVal type:(PVAttractionType)types;
{
    self = [super init];
    
    if (self != nil) {
        coordinate = location;
        title = placeName;
        subtitle = description;
        _alertAddress=alertAddressVal;
        _alertImage=alertImageVal;
        _alertTime=alertTimeVal;
        _alertType=alertTypeVal;
        _alertID=alertidVal;
        _type=types;
    }
    return self;
}

- (void)dealloc {
   
}
@end
