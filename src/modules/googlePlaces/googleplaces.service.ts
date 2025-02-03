import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class GooglePlacesService {
    private readonly GooglePlaceServiceLogger = new Logger('GooglePlacelogger');

    constructor(private readonly httpService: HttpService) { }

    async getPlaceSuggestions(query: string) {
        try {
            const response: any = await this.httpService.get(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${process.env.PLACES_AUTH_KEY}&types=(cities)&components=country:IN`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const data: any = await firstValueFrom(response);
            return data.data;
            // return await firstValueFrom(response);
        } catch (error) {
            // this.GooglePlaceServiceLogger.error('Failed to fetch places data', error.message);
            // this.GooglePlaceServiceLogger.debug('Error details', { error: this.safelyParseError(error) });
            console.log("INISDE CATCH");
            // throw new Error(`Failed to get places data: ${error.message}`);
        }
    }

    async getPlaceData(placeId: string) {
        try {
            const response: any = await this.httpService.get(
                `https://maps.googleapis.com/maps/api/place/details/json?fields=name%2Caddress_components%2Cformatted_address%2Cplace_id&place_id=${placeId}&key=${process.env.PLACES_AUTH_KEY}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const data: any = await firstValueFrom(response);
            // console.log(data)
            return data.data;
            // return await firstValueFrom(response);
        } catch (error) {
            // this.GooglePlaceServiceLogger.error('Failed to fetch places data', error.message);
            // this.GooglePlaceServiceLogger.debug('Error details', { error: this.safelyParseError(error) });
            // console.log("INISDE CATCH");
            throw new Error(`Failed to get places data: ${error.message}`);
        }
    }

    private safelyParseError(error: any) {
        return JSON.stringify(error, (key, value) => {
            if (key === 'request' || key === 'response') {
                // Skip circular references or large objects
                return undefined;
            }
            return value;
        }, 2); // 2-space indentation
    }
}
