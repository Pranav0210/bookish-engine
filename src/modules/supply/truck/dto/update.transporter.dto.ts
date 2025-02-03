export class UpdateTransporterDto {
    companyName: string;
    homeBase: OperatingCity;
    operatingCities: OperatingCity[]
}

interface OperatingCity {
    name: string;
    placeId: string;
}