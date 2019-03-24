// using System.Collections.Generic;
// using System.Linq;
// using AutoUsing.Analysis.DataTypes;

// namespace AutoUsing.Analysis.Cache
// {
//     public class ExtensionMethodInfoList : CompletionDataInfoList<ExtensionMethodInfo,ExtensionClass>
//     {
//         public override List<ExtensionClass> ToCompletionFormat()
//         {

//             var grouped = this.AllCompletionData
//                 .GroupBy(ExtendedClassName)
//                 .Select(extensionMethods => extensionMethods.GroupBy(extensionMethod => extensionMethod.Method));

//             return grouped
//                 .Select(extendedClass => new ExtensionClass(extendedClass.First().First().Class,
//                     extendedClass.Select(extensionMethod => new ExtensionMethod(extensionMethod.First().Method,
//                         extensionMethod.Select(info => info.Namespace).Distinct().ToList())).Distinct().ToList()))
//                 .ToList()
//                 .OrderBy(extendedClass => extendedClass.ExtendedClass)
//                 .ToList();

//         }

//         private static string ExtendedClassName(ExtensionMethodInfo info) => (info.Class).NoTilde();
//     }
// }