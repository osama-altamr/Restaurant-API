import { Schema, Prop } from '@nestjs/mongoose';

@Schema()
export class Location {
  @Prop({ enum: ['Point'] })
  type: string;

  @Prop({ index: '2dshpere' })
  coordinates: number[];
  formattedAddress: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}
