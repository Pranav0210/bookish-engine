export class CreateTransporterDto {
    companyName: string;
    homeBase: OperatingCity;
    operatingCities: OperatingCity[]
}

interface OperatingCity {
    name: string;
    placeId: string;
}