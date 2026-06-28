import { ClassSerializerInterceptor, Controller, SerializeOptions, UseInterceptors } from "@nestjs/common";

@Controller('farms')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class FarmsController {
    
}